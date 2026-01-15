{ pkgs ? import <nixpkgs> { } }:

pkgs.callPackage ./imgfloat-client.nix { }
