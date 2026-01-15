{ lib
, buildNpmPackage
, fetchFromGitHub
, makeWrapper
, electron
}:

buildNpmPackage rec {
  pname = "imgfloat-client";
  version = "1.0.5";

  src = fetchFromGitHub {
    owner = "imgfloat";
    repo = "client";
    rev = "v${version}";
    hash = lib.fakeSha256;
  };

  npmDepsHash = lib.fakeSha256;
  npmBuild = false;
  npmFlags = [ "--ignore-scripts" ];

  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ electron ];

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share/imgfloat
    cp -R src res package.json node_modules $out/share/imgfloat/

    mkdir -p $out/bin
    makeWrapper ${lib.getExe electron} $out/bin/imgfloat \
      --add-flags $out/share/imgfloat/src/main.js \
      --set-default ELECTRON_IS_DEV 0

    runHook postInstall
  '';

  meta = with lib; {
    description = "Electron based desktop client for viewing the imgfloat broadcast dashboard";
    homepage = "https://github.com/imgfloat/client";
    license = licenses.mit;
    mainProgram = "imgfloat";
    platforms = platforms.linux;
    maintainers = [];
  };
}
