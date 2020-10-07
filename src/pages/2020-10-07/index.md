---
path: /patching-on-dotnet-core
date: 2020-10-07T17:12:33.962Z
title: Patching on .NET Core
topic: .NET Core
readTime: 3 min
author: Ian
featuredImage: ../../images/patch.png
authorImage: ../../images/authors/ian.jpg
ogImagePath: /posts/patching-on-dotnet-core/images/og-image.png
description: "Here we'll talk about a very opinionated patch method in a strongly typed language"
---
Patching a REST API like you're used isn't natively supported in .NET Core, which is a real bummer. 

The reason it doesn't work is quite simple. The JSON reader built into .NET Core tries to parse json into C# objects (also known as POCO's).
However when a property of that object cannot be found, it doesn't remove the property, it just makes the value `null`.

So there you are, POCO in hand, ready for action, but you can't know whether the user who made the request wants to set 
the property to `null`, or didn't send the property at all!

In short; you can't differentiate between these two requests bodies:

*I want `foo` to become null:*
```json
{
  "foo": null,
  "bar": true
}
```

*I want `foo` to remain the what it was:*
```json
{
  "bar": true
}
```

JSON Patch (the one in [RFC 6902](https://tools.ietf.org/html/rfc6902), yeah that weird one) *is* supported out of the 
box in .NET Core. So if you're into that, check out the docs on implementing it [here](https://docs.microsoft.com/en-us/aspnet/core/web-api/jsonpatch?view=aspnetcore-3.1).

## Figuring out what a user wants
So the challenge is quite clear:
**check if the initial request body has the property, and if it does, 
only then update the property**.

To do this we can use a very cool feature of .NET Core called `Formatters` (see docs on formatters [here](https://docs.microsoft.com/en-us/aspnet/core/web-api/advanced/custom-formatters?view=aspnetcore-3.1)). They allow custom formatting of request bodies. 
So let's say you want to support someone POSTing a CSV file, you can write your own parser for that! Pretty neat.

Down below is an implementation which deserializes the posted JSON into a POCO and binds a `JsonDocument` with all the 
fields that were sent in the request body to the `HttpContext` (which you can access in the controller).

```csharp
 using System;
 using System.IO;
 using System.Text.Json;
 using System.Threading.Tasks;
 using Microsoft.AspNetCore.Mvc.Formatters;
 using Microsoft.Net.Http.Headers;
 using Willian.Dtos.Patch;
 
 namespace Willian.Formatters
 {
     public class PatchInputFormatter : InputFormatter
     {
         public PatchInputFormatter()
         {
             // Run this formatter when patching
             SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/json-patch+json"));
         }
 
         protected override bool CanReadType(Type type)
         {
             // Only run when the type is of PatchDto
             return type.BaseType == typeof(PatchDto);
         }
 
         public override async Task<InputFormatterResult> ReadRequestBodyAsync(
             InputFormatterContext context)
         {
             using var reader = new StreamReader(context.HttpContext.Request.Body);
             var json = await reader.ReadToEndAsync();
             var dto = JsonSerializer.Deserialize(
                 json,
                 context.ModelType,
                 new JsonSerializerOptions()
                 {
                     PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                     AllowTrailingCommas = true
                 });
             var updatedItems = JsonDocument.Parse(json, new JsonDocumentOptions()
             {
                 AllowTrailingCommas = true
             });
             // bind to HttpContext
             context.HttpContext.Items.Add("ChangedFields", updatedItems);
             return await InputFormatterResult.SuccessAsync(dto);
         }
     }
 }
```

So this has some parts that need explaining:
```csharp
protected override bool CanReadType(Type type)
{
    // Only run when the type is of PatchDto
    return type.BaseType == typeof(PatchDto);
}
```

This part is responsible for deciding whether to use this `InputFormatter` or not. I have created an empty class called `PatchDto`, 
which acts as an indicator. If I want to use a POCO in a patch request, I just need to extend the `PatchDto` and this `InputFormatter` starts purring.

## Setting up the custom InputFormatter
In your `Startup.cs` add this part to your `addControllers` section:
```csharp
opt.InputFormatters.Insert(0, new PatchInputFormatter());
```

Which should make it look a little something like:
```csharp
services.AddControllers(
    opt =>
    {
        opt.InputFormatters.Insert(0, new PatchInputFormatter());
    }
)
```


## Using the input formatter
In your controller function you can get the `JsonDocument` with all the original properties of the request using:
```csharp
var changedFields = (JsonDocument)HttpContext.Items["ChangedFields"];
var element = changedFields.RootElement;
```

With a little class extension for `JsonElements`:
```csharp
public static bool HasProperty(this JsonElement document, string element)
{
    try
    {
        document.GetProperty(element);
        return true;
    }
    catch (KeyNotFoundException)
    {
        return false;
    }
}
```

You can do things in your controller like:
```csharp
if (element.HasProperty("foo"))
{
    lmao.Foo = dto.Foo;
}
```

## Wrapping up
So there you have it. A very straightforward method of using a Patch request like you're used to!

Also make sure that the request you're making has **`content-type:'application/json-patch+json'`** set as header!

And as always, if you need any help setting up or feel there is something missing in this post, please reach out [reach out](https://yik.dev/contact)!