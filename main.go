package main

import (
	"context"
	cronjobLib "nns/project/lib/cronjob"
	firebaseLib "nns/project/lib/firebase"
	speedTestLib "nns/project/lib/speedtest"
	"os"
	"os/signal"
	"syscall"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/showwin/speedtest-go/speedtest"
	log "github.com/sirupsen/logrus"
	"google.golang.org/api/option"
)

var firestoreClient *firestore.Client;

func task() {
	log.Info("Start to test the network speed.")
	client := speedtest.New()

	// Trying to fetch the servers.
	serverList, err := speedTestLib.FetchServer(client)
	if err != nil {
		return
	}

	// Trying to specific the server.
	targets, err := speedTestLib.FindServer(serverList, []int{})
	if err != nil {
		return
	}

	// Test the speed for each server.
	for _, server := range targets {
		server.PingTest(nil)
		server.DownloadTest()
		server.UploadTest()
		log.Infof("Latency: %s, Download: %f, Upload: %f\n", server.Latency, server.DLSpeed, server.ULSpeed)
		firebaseLib.UploadDocument(firestoreClient, firebaseLib.NetworkRecord{
			Ping:          server.Latency.Milliseconds(),
			DownloadSpeed: server.DLSpeed,
			UploadSpeed:   server.ULSpeed,
		})
		server.Context.Reset()
	}
}

func init(){
	log.SetFormatter(&log.TextFormatter{
		ForceColors: true,
	})
	
	ctx := context.Background()
	opt := option.WithCredentialsFile("firebaseCredential.json")
	
	// Trying to initialize the firebase.
	app, err := firebase.NewApp(context.Background(), nil, opt)

	if err != nil {
		log.Fatal("Error on initialize the firebase, exit.")
	}

	log.Info("Successful initialize the firebase.")

	// Trying to have a client.
	firestoreClient, err = app.Firestore(ctx)

	if err != nil {
		log.Fatal("Error on have a client, exit.")
	}

	log.Info("Successful Initialize the application.")
}

func main() {
	

	s := cronjobLib.CreateScheduler()
	job := cronjobLib.CreateNewJob(s, task)

	log.Info("The cron job ID is ", job.ID())

	s.Start()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)

	log.Info("Press Control + C to exit.")
	<-sig

	s.Shutdown()
	log.Info("Good Bye.")
}
