package main

import (
	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"github.com/zmb3/spotify/v2"
)

const redirectURI = "http://localhost:8080/callback"

var (
	auth  = spotifyauth.New(spotifyauth.WithRedirectURL(redirectURI), spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate))
	ch    = make(chan *spotify.Client)
	state = "abc123"
	// These should be randomly generated for each request
	//  More information on generating these can be found here,
	// https://www.oauth.com/playground/authorization-code-with-pkce.html
	codeVerifier  = "5pBC87DaHFLuM70UjUiEHHm0SWJCoXTiUYZznM6Mh3ezjXBi"
	codeChallenge = "uzdz88Did8JXVe3xoa1DdwLVNT8OATZ0T2SIXDIDjzg"
)
