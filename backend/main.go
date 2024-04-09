package main

import (
	"context"
	cronjobLib "nns/project/lib/cronjob"
	firebaseLib "nns/project/lib/firebase"
	settingLib "nns/project/lib/setting"
	speedTestLib "nns/project/lib/speedtest"
	"os"
	"os/signal"
	"syscall"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/showwin/speedtest-go/speedtest"
	log "github.com/sirupsen/logrus"
	"google.golang.org/api/option"
)

var firestoreClient *firestore.Client;
var setting settingLib.Setting;

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

	heartbeatCollectionName := "heartbeat"
	recordCollectionName := "record"

	if setting.Mode == "WIFI" {
		heartbeatCollectionName = "wifi-heartbeat"
		recordCollectionName = "wifi-record"
	}

	// Test the speed for each server.
	for _, server := range targets {
		// Trying to test the ping
		err := server.PingTest(nil)
		if err != nil {
			firebaseLib.UploadDocument(firestoreClient, heartbeatCollectionName, firebaseLib.HeartbeatRecord{
				Time:    time.Now(),
				IsAlive: false,
			})
			log.Error("Failed on test the ping. Task shutdown.")
			break
		}

		// Trying to test the download speed
		err = server.DownloadTest()
		if err != nil {
			firebaseLib.UploadDocument(firestoreClient, heartbeatCollectionName, firebaseLib.HeartbeatRecord{
				Time:    time.Now(),
				IsAlive: false,
			})
			log.Error("Failed on test the download speed. Task shutdown.")
			break
		}

		// Trying to test the upload speed
		err = server.UploadTest()
		if err != nil {
			firebaseLib.UploadDocument(firestoreClient, heartbeatCollectionName, firebaseLib.HeartbeatRecord{
				Time:    time.Now(),
				IsAlive: false,
			})
			log.Error("Failed on test the upload speed. Task shutdown.")
			break
		}

		log.Infof("Provide by %s, Latency: %s, Download: %f, Upload: %f\n", server.Sponsor, server.Latency, server.DLSpeed, server.ULSpeed)
		firebaseLib.UploadDocument(firestoreClient, recordCollectionName, firebaseLib.NetworkRecord{
			Time:          time.Now(),
			IPS:           server.Sponsor,
			Ping:          server.Latency.Milliseconds(),
			DownloadSpeed: server.DLSpeed,
			UploadSpeed:   server.ULSpeed,
		})
		
		firebaseLib.UploadDocument(firestoreClient, heartbeatCollectionName, firebaseLib.HeartbeatRecord{
			Time:    time.Now(),
			IsAlive: true,
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

	settingFile, err := os.Open("settings.json")

	if err != nil {
		log.Fatal("Error on open settings.json, please check the file exists. exit.")
	}

	setting, err = settingLib.LoadSetting(settingFile)

	if err != nil {
		log.Fatal("Error on loading settings, please check the json format is correct. exit.")
	}

	err = settingFile.Close();

	if err != nil {
		log.Fatal("Error on close settings. Maybe the file already closed? exit.")
	}
}

func main() {
	s := cronjobLib.CreateScheduler()
	job := cronjobLib.CreateNewJob(s, task)

	log.Info("The cron job ID is ", job.ID())
	
	s.Start()
	job.RunNow()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)

	log.Info("Press Control + C to exit.")
	<-sig

	s.Shutdown()
	log.Info("Good Bye.")
}
