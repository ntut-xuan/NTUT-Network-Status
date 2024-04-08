package cronjobLib

import (
	"time"

	"github.com/go-co-op/gocron/v2"
	log "github.com/sirupsen/logrus"
)

func CreateScheduler() gocron.Scheduler {
	s, err := gocron.NewScheduler()

	if err != nil {
		log.Error(err)
		panic(err)
	}

	log.Info("Successfully create scheduler.")

	return s
}

func CreateNewJob(s gocron.Scheduler, task any) gocron.Job {
	duration := 1*time.Hour;
	job, err := s.NewJob(
		gocron.DurationJob(
			duration,
		),
		gocron.NewTask(
			task,
		),
	)

	if err != nil {
		log.Error(err)
		panic(err)
	}

	log.Infof("Successfully create %v cronjob.", duration)

	return job
}
