with (import <nixpkgs> {});
let
  gems = bundlerEnv {
    name = "grant-ai";
    inherit ruby;
    gemdir = ./.;
  };
in stdenv.mkDerivation {
  name = "grant-ai";
  buildInputs = [gems ruby];
}
