---
path: /redeploying-static-frontend
date: 2020-10-14T17:12:33.962Z
title: Redeploying a static frontend with Netlify
keywords: Deploy,Netlify,Static,Nuxt,Gatsby,Next
topic: Devops
readTime: 2 min
author: Ian
featuredImage: ../../images/redeploying-static-frontend.png
authorImage: ../../images/authors/ian.jpg
ogImagePath: /posts/redeploying-static-frontend/images/og-image.png
description: "Building static pages is great, but when you add new content you should redeploy your site. I'll show 
you how with Netlify build hooks."
---
Building static pages is great. They offer blazing fast loading times, and develop just as easy as an SPA. 
Most frameworks have a static variant by now: 

* Nuxt.js for Vue.js
* Next/Gatbsy for React
* Sapper for Svelte

The thing with static websites (especially ones who have a CMS (like a webshop)) is that when you add a new page, 
you have to redeploy the entire thing.

Luckily Netlify has something to ease the suffering of sending build commands over and over again; [Build hooks](https://docs.netlify.com/configure-builds/build-hooks/).

The problem we faced building [loopground.com](https://loopground.com) was that we would add new products to the system very often, but our Nuxt.js frontent didn't know about those new 
products. So we needed a way to make sure the frontend rebuild when the backend added more content.

What we ended up doing is combining the frontend rebuild with our search index seed. This causes the frontend to rebuild 
everytime we send a command to re-seed the search index or when the backend image starts spinning up.

I'll show you a small C# code sample of the code we used to rebuild Nuxt.js with Netlify. Super simple stuff but works perfectly!

*The build service*

```csharp
namespace Willian.Services.BuildService
{
    public class NetlifyBuildFrontendService : IBuildFrontendService
    {
        private readonly HttpClient _client;
        private readonly string _webHookUrl;

        public NetlifyBuildFrontendService(HttpClient client, string webHookUrl)
        {
            _client = client;
            // Comes from ENV (looks something like https://api.netlify.com/build_hooks/XXXXXXXXXXXXXXX)
            _webHookUrl = webHookUrl;
        }

        public async Task BuildFrontendAsync()
        {
            await _client.PostAsync(_webHookUrl, null);
        }
    }
}
```

*Running on startup*

```csharp
public static void Main(string[] args)
{
    CreateHostBuilder(args)
        .Build()
        .ConnectToDatabase(5, TimeSpan.FromSeconds(5))
        .MigrateDatabase()
        .SeedData()
        .ConnectToElasticSearch(5, TimeSpan.FromSeconds(5))
        // Seed our search index
        .SeedElastic()
        // Send build command to Netlify (build service)
        .BuildFrontend()
        .Run();
}
```

## Wrapping up
Hopefully this very short blogpost helps ease the fears of moving to statically generated webapps! It really isn't difficult to 
implement it with a highly changing CMS, and it offers such a large SEO benefit, much lower backend loads, as well as plain *SPEEEED*.
 
I *love* chatting about how the internet *should* look. Do you think it should be driven by `html` pages only, or do you believe the future to be one large `js` file which works like an app in your browser?
[Let me know](https://yik.dev/contact)!