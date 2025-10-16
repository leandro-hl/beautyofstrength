// Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package webpush

// Urgency indicates to the push service how important a message is to the user.
// This can be used by the push service to help conserve the battery life of a user's device
// by only waking up for important messages when battery is low.
type Urgency string

const (
	// UrgencyVeryLow requires device state: on power and Wi-Fi
	UrgencyVeryLow Urgency = "very-low"
	// UrgencyLow requires device state: on either power or Wi-Fi
	UrgencyLow Urgency = "low"
	// UrgencyNormal excludes device state: low battery
	UrgencyNormal Urgency = "normal"
	// UrgencyHigh admits device state: low battery
	UrgencyHigh Urgency = "high"
)

// Checking allowable values for the urgency header
func isValidUrgency(urgency Urgency) bool {
	switch urgency {
	case UrgencyVeryLow, UrgencyLow, UrgencyNormal, UrgencyHigh:
		return true
	}
	return false
}
