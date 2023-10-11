---
layout: default
title: Design
nav_order: 3
has_children: false
has_toc: false
---


# Design
{: .no_toc }

Greenfield consists of many separate [components](/greenfield/pages/components). We'll go over the most relevant ones in detail.

- 
{:toc}

## Compositor

The Compositor package is at the center of everything. It's responsible for drawing pixels on the screen and handling all
user input.

## Compositor Shell

The Compositor Shell provides an implementation of the Compositor. It provides auxiliary controls and their UI.

## Compositor Proxy

The Compositor Proxy acts as a real native Wayland compositor and deals all communication between a native Wayland application
and the Compositor running in the browser.

## Compositor Proxy CLI

The Compositor Proxy CLI provides an implementation on top of the Compositor Proxy and works together with the
Compositor Shell.
