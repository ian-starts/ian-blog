---
path: /risk-electronic-voting
date: 2020-11-02T17:12:33.962Z
title: Why electronic voting is dangerous
keywords: Voting, Election,electronic voting, internet voting
topic: Random
readTime: 8 min
author: Ian
featuredImage: ../../images/electronic-voting.png
authorImage: ../../images/authors/ian.jpg
ogImagePath: /posts/electronic-voting/images/og-image.png
description: "Electronic voting is potentially a huge upside, especially when social distancing. What are the risks? What would a solution look like?"
---
With the 2020 US elections having mail in ballots, 
I found myself wondering if a digital solution would be safer, more reliable and easier. As usual the answer isn't straightforward. 

In this post I'll talk you through some possible solutions and their potential downsides.

I will mostly focus on Dutch elections, seeing as I can provide the best insights, and most arguments are easily 
transferable to other nations.

## Requirements
If we would develop a voting system from scratch it would need to have some features that protect our rights and make 
sure the elected ruler is the one the people really wanted (questionable if that's the case with current electoral systems, but that's for another time).

1.  **Accuracy** - are all the votes counted, do they represent the will o' the people?
2.  **Anonymity** - very difficult this one. We don't want the votes to be signed, that would leave opportunities for 
coercion and intimidation. However, we do need to verify that the voter is eligible to vote (or a real person at all for that matter).
3.  **Verifiability** - we need to be able to verify if the process went correctly.
3. **Speed** - it would be useful if votes would be counted quicker. 

A big problem with anonymity and verifiability is that making votes anonymous makes them difficult to verify.

If we had a database with all the people who voted, and their cast vote, verifiability would be tackled. However, it wouldn't be anonymous.



## e-voting vs i-voting
When discussing electronic voting there are essentially two things at play. 
1. **e-voting** - voting on a machine on location. Like 35 municipalities did in the Netherlands between roughly 1970 and 2007.
2. **i-voting** - voting online using a device connected to the internet.

e-voting is usually seen as the easier one. You can tackle anonymity by submitting anonymous votes, and verify it 
manually with a passport check before entering the voting booth.

i-voting is much more difficult, because you can't have the manual check.

## We can protect our back accounts, so how hard can protecting votes be, right?
Well, unless you're part of a secret society with unlimited wealth, chances are your bank account is not a very interesting target.

The scale of an election is massive. The decision made there has so much influence, 
that it's an incredibly high value target.

> Most hackers aren't hardcore geeks typing away on their kali linux distro. It's usually a game of 
> influencing people, leaked data or a weak password. This can be summarised as the *human error*.

It's much more likely hackers will pour resources into hacking an election than a bank account.

## e-voting
e-voting seems like a pretty good idea. it's pretty straight forward on an abstract level: keep everything the same, only make the counting digital.

Too bad it's an oversimplification. It's impossible for most voters to check how the system works internally. 
Even if the voters were all programmers, the source code doesn't have to be open-source. There's no rule against making the source code private. 

So basically, it's a black box which we have to trust with one of the most important things in a democracy, and impossible for any voter to check the process.

This fear is backed by a [2009 decision](https://www.bundesverfassungsgericht.de/SharedDocs/Pressemitteilungen/EN/2009/bvg09-019.html) by the Federal Constitutional Court of Germany:
> The use of voting machines which electronically record the voters’ votes and electronically ascertain the election 
>result only meets the constitutional requirements if the essential steps of the voting and of the ascertainment of the 
>result can be examined reliably and without any specialist knowledge of the subject.  

Beside these 'lack of control' fears, a lot of systems have failed miserably over the years.
 
The lack of pen-testing (inviting good-guy hackers to attack your system and check for vulnerabilities) makes it very hard to pinpoint exact failures, but here's a curated list of found problems in the US:

* 2003 – In Fairfax, new voting machines either didn’t work, or would lose the voter’s choice after a few moments.
* 2003 – The State of Maryland found that the Diebold Election Systems, Inc. (now rebranded as Premier Election Solutions) AccuVote-TS system “as implemented in policy, procedure, and technology, is at high risk of compromise.”
* 2002-2006 – During this period, Election Systems and Software, the US’s leading voting machine manufacture was shipping some of its systems with remote access software, making them vulnerable to hacking.  
* 2006 – Researchers from the Voting Systems Technology Assessment Advisory Board (VSTAAB) and the University of California corroborated previous research that found various Diebold voting machines can have the votes on their memory cards tampered with in a way that cannot be detected. They found a number of other security vulnerabilities as well.
* 2006 – Princeton researchers studied the Diebold AccuVote-TS and found that it was vulnerable to a range of serious attacks. These included the possibility of malware installation which could be used to alter the vote.
* 2015 – The Virginia Information Technologies Agency assessed the WinVote machine, which is manufactured by Advanced Voting Solutions. The agency recommended discontinuing the use of these machines after they found a range of serious flaws such as weak passwords, outdated security protocols, and insufficient system hardening.
* 2018 – At DEFCON, J. Alex Halderman showed that Diebold AccuVote TSX voting machines could be manipulated remotely in a mock election. The same vulnerable machines were being used in 18 different states. After the event, a 50 page report was released, detailing vulnerabilities in Election Systems & Software’s M650 machine and the Diebold AccuVote TSX. Together, these machines are used in as many as 23 states.
* 2018 – Some voters in Texas allege that the Hart InterCivic’s eSlate machine was switching their vote to another candidate in the state’s election for senator.

And of course a Dutch problem:
* 2007 - It was possible to read and analyse the Electromagnetic radiation of voting machines from dozens of meters away. This caused the anonymity to be completely compromised.

Side-note; this was known before an election took place. Still, parts of the election were held with the voting machines, 
causing the Dutch government to be sued, losing, and going back to paper ballots.

So yeah, e-voting; not perfect.

## Hopes for e-voting
More recently there has been talk of re-instating e-voting with some big adaptations. 

The new version would basically be a computer with a printer. You can cast your vote in a voting booth with no 
connectivity to the web. The voting machine would print your vote on a piece of paper, which you can then check for errors and deposit in the voting box.
These printed votes are easily read by a central computer, making counting them a lot easier and quicker.

Though this seems like an interesting concept, it's also doesn't have a lot of benefits over paper ballots. As the software axiom goes "keep it simple, stupid",
this doesn't really comply.

## i-voting
I-voting, also known as remote e-voting, is casting your vote from the comfort of your own couch.
The only country which implemented such a system is Estonia. With tech giants migrating more of your life to the internet, 
it seems that it's only logical to move to i-voting. Let's take a look at Estonia. How their system works, 
what the vulnerabilities are, and whether we should follow suit.

### How it works
Estonia's i-voting system builds on their ID card. This ID card is also a smart card and allows owners to digitally 
sign documents and facilitates secure authentication. This already laid infrastructure makes it possible to tackle one of our demands; **verifiability**.

The i-voting system is available in an early voting period (sixth day to fourth day prior to Election Day). You can 
change your vote an unlimited amount of times in that timeframe. You can also overwrite your vote by going to a 
polling station, invalidating your i-vote.

When this new voting method was first introduced, the president Arnold Rüütel challenged i-voting, claiming breach of the principle of equality of voting.
The president brought a petition against the e-voting provisions to Estonian Supreme Court but lost. Rüütel was mostly 
popular amongst the still Russian speaking elderly minority. About 1.9% voted online in the 
[2005 election](https://archive.is/20120713045721/http://news.com.com/Estonia+pulls+off+nationwide+Net+voting/2100-1028_3-5898115.html). 
This has increased over the years to [43.8% in 2019](https://rk2019.valimised.ee/en/voting-result/voting-result-main.html).

Estonia also open-sourced much of their source code to make the system as transparent as possible. They haven't 
released everything (annoying some critics). Most notably, all the client side code is missing (more in that later).

One of the biggest things going for i-voting is potentially increasing voter turnout, however that 
claim has been [mostly invalidated.](https://core.ac.uk/download/pdf/95665595.pdf)
  
### Vulnerabilities
One peer [reviewed research paper](https://estoniaevoting.org/findings/paper/) claims the researchers could be able to 
breach the system, change votes and vote totals, and erase any evidence of their actions if they could install
 malware on the election servers. Now of course, it's basically impossible to breach the security of election servers.
  However, circling back to human error; what if someone is bribed, careless, or just malicious? The stakes are immense, 
  and these edge cases can not be ignored.
  
Another gaping security hole is the personal device of the voter. This may be the weakest link in the chain. 
The system is quite robust after the ballot has been cast. However, sending that ballot is not trivial. 

It's easy to write a fake web client (hence the hidden source code. That would make it too easy), 
tricking people into thinking they've already voted. Or a piece of malware, sending a different vote than you typed.

The Estonian National Electoral parried these criticisms, [claiming](http://vvk.ee/valimiste-korraldamine/vvk-uudised/vabariigi-valimiskomisjoni-vastulause-the-guardianis-ilmunud-artiklile) 
they "give us no reason to suspend online balloting". The purported vulnerabilities were said to be either not feasible in reality or already accounted for in the design of the e-voting system.

The Estonian Information System Authority also responded. Claiming the criticisms as a political, rather than technical, 
attack on the e-voting system.
 
As a technical guy, I can relate to the Estonian Information System Authority. Their system is probably pretty 
airtight from a technical standpoint, however it's nearly impossible to account for the *human error*

## Conclusion
I was going to write a big recommendation here, but I don't have a great solution either. 

E-voting, and especially i-voting make life a bit easier, but they carry massive risks. If you try to patch all those potential security holes, you come eerily close to paper ballots.

So why go through this trouble? It doesn't increase voter turnout, and comes with a ton of extra headaches.

Maybe just stay with paper and a good old pencil? 

