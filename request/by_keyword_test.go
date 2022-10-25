package request

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestByKeyword(t *testing.T) {
	const l = 5
	SetClient(byKeywordClient)
	tweets, err := TweetsByKeyword("", l)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
	if len(tweets) != 5 {
		t.Errorf("Expected the amount of tweets to be as requested")
	}
	twts, err := byKeywordResponse.Tweets()
	if err != nil {
		t.Errorf("Did not expect error while decoding sample tweet data")
	}
	assert.Equal(t, tweets, twts[:l], "Expected IDs to match")
}
