{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  packages = [
    pkgs.electron
    pkgs.mesa
    pkgs.nodejs
    pkgs.openbox
    pkgs.vulkan-loader
    pkgs.wayland
    pkgs.wayland-protocols
    pkgs.weston
    pkgs.xorg.xorgserver
    pkgs.xwayland
  ];
}
