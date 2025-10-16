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

package main

import (
	"encoding/base64"
	"flag"
	"fmt"
	"github.com/leandro-hl/beautyofstrength/back/db"
	"github.com/leandro-hl/beautyofstrength/back/util"
	"github.com/leandro-hl/beautyofstrength/back/webpush"
	"strings"
	"time"
)

type Config struct {
	VapidPublicKey  *string `json:"vapidPublicKey"`
	VapidPrivateKey *string `json:"vapidPrivateKey"`
	VapidDataKey    *string `json:"vapidDataKey"`
	DatasourceName  *string `json:"datasourceName"`
}

func main() {
	confSpec := util.FlagString("conf", "back/worker/conf.json", "Config")
	flag.Parse()

	//the worker should run always after 9pm
	dif := 20 - time.Now().Hour()
	if dif > 0 {
		time.Sleep(time.Duration(dif) * time.Hour)
	}

	config := Config{}
	util.LoadConfig(*confSpec, &config)
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()
	db := db.InitDB(*config.DatasourceName, 3)
	key, err := base64.StdEncoding.DecodeString(*config.VapidDataKey)
	util.Check(err)
	execute(config, db, key)

	for range ticker.C {
		execute(config, db, key)
	}
}

func execute(config Config, sql *db.DB, key []byte) {
	//todo: cualquiera que este debugueando con el browser puede mandarme subscriptions al mismo dispositivo N veces!!!
	// el user agent cambia dependiendo de que dispositivo estamos usando en el browser...
	devices := db.SelectAllUserDeviceSubscriptions(sql)
	for _, d := range devices {
		vapiddata, _ := util.Decrypt(*d.VapidData, key)
		var sub webpush.Subscription
		util.JsonDecode(&sub, strings.NewReader(vapiddata))
		webpush.SendNotification([]byte("QUESTION_TRAINED_TODAY"), &sub, &webpush.Options{
			//Topic:   "", //check it
			TTL:     60, //secs
			Urgency: "medium",
			VAPID: webpush.VAPID{
				PublicKey:  *config.VapidPublicKey,
				PrivateKey: *config.VapidPrivateKey,
			},
			//RecordSize: 0,
			//Subscriber: "",
		})
		fmt.Println("Notification sent to: " + sub.Endpoint)
	}
}
