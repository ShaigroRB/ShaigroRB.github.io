---
title: "How to locally test changes to a golang module"
date: 2023-03-05T13:53:28+01:00
tags: ["golang", "go"]
category: ["tutorial"]
---

## Problem

I have a [golang module](https://github.com/ShaigroRB/go-free-discount-itch) called `fditch` that I have updated. I want to test the modified module locally without needing to publish it.

## Requirements

To properly test my module, I created another go module called `example` that uses the `fditch` module.

My directory structure looks like this:

```
.
├── fditch/
│   ├── go.mod
│   └── ...
└── example/
    ├── go.sum
    ├── go.mod
    └── main.go
```

In _main.go_, I simply make use of the module. The _go.mod_ file looks like this:

```golang
module example.com/m

go 1.19

require (
	github.com/ShaigroRB/go-free-discount-itch v1.0.0 // indirect
	golang.org/x/net v0.7.0 // indirect
)
```

## Solution

The "**replace**" keyword can be used in the _go.mod_ file to point to a local module instead of the one on the web.

After the change, the _go.mod_ file looks like this:

```golang
module example.com/m

go 1.19

require (
	github.com/ShaigroRB/go-free-discount-itch v1.0.0 // indirect
	golang.org/x/net v0.7.0 // indirect
)

// Here the path is relative. It works with absolute paths too.
replace github.com/ShaigroRB/go-free-discount-itch => ../fditch
```
