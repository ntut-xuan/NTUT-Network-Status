package firebaseLib

import (
	"context"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

type NetworkRecord struct {
	Ping int64
	DownloadSpeed float64 
	UploadSpeed float64
}

func UploadDocument(client *firestore.Client, record NetworkRecord) (uuid.UUID, error) {
	uuid := uuid.New();
	ctx := context.Background()
	result, err := client.Collection("records").Doc(uuid.String()).Set(ctx, record)

	if err != nil {
		log.Error("Error on set the data.")
		return uuid, err
	}

	log.Infof("Successful on writing the data %s on %v", uuid.String(), result.UpdateTime)
	return uuid, nil
}
