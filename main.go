package main

import (
	cronjobLib "nns/project/lib/cronjob"
	speedTestLib "nns/project/lib/speedtest"
	"os"
	"os/signal"
	"syscall"

	"github.com/showwin/speedtest-go/speedtest"
	log "github.com/sirupsen/logrus"
)

func task() {
	log.Info("Start to test the network speed.")
	client := speedtest.New()
	serverList := speedTestLib.FetchServer(client)
	targets := speedTestLib.FindServer(serverList, []int{})

	for _, s := range targets {
		// Please make sure your host can access this test server,
		// otherwise you will get an error.
		// It is recommended to replace a server at this time
		s.PingTest(nil)
		s.DownloadTest()
		s.UploadTest()
		log.Infof("Latency: %s, Download: %f, Upload: %f\n", s.Latency, s.DLSpeed, s.ULSpeed)
		s.Context.Reset() // reset counter
	}
}

func main() {
	log.SetFormatter(&log.TextFormatter{
		ForceColors: true,
	})

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
