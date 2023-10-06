package main

import (
	"encoding/base64"
	"flag"
	"github.com/jmoiron/sqlx"
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
	sql := db.InitDB(*config.DatasourceName)
	key, err := base64.StdEncoding.DecodeString(*config.VapidDataKey)
	util.Check(err)
	execute(config, sql, key)

	for range ticker.C {
		execute(config, sql, key)
	}
}

func execute(config Config, sql *sqlx.DB, key []byte) {
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
	}
}
