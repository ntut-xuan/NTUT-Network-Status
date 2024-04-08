package firebaseLib

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	log "github.com/sirupsen/logrus"
)

type NetworkRecord struct {
	Time time.Time
	IPS string
	Ping int64
	DownloadSpeed float64 
	UploadSpeed float64
}

type HeartbeatRecord struct {
	Time time.Time
	IsAlive bool
}

func UploadDocument(client *firestore.Client, collection string, record interface{}) (string, error) {
	time := time.Now();
	timeFormatString := time.Format("2006-01-02T15:00:00Z07:00")
	ctx := context.Background()
	result, err := client.Collection(collection).Doc(timeFormatString).Set(ctx, record)

	if err != nil {
		log.Error("Error on set the data.")
		return timeFormatString, err
	}

	log.Infof("Successful on writing the data %s to collection %s on %v", timeFormatString, collection, result.UpdateTime)
	return timeFormatString, nil
}
