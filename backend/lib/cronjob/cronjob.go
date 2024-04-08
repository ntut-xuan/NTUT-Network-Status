package cronjobLib

import (
	"time"

	"github.com/aptible/supercronic/cronexpr"
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
	crontab := "0 * * * *"
	currentTime := time.Now()
	nextFire := cronexpr.MustParse(crontab).Next(currentTime)
	cronjob := gocron.CronJob(
		crontab,
		false,
	)
	job, err := s.NewJob(
		cronjob,
		gocron.NewTask(
			task,
		),
	)

	if err != nil {
		log.Error(err)
		panic(err)
	}

	log.Info("Cronjob Set!")
	log.Infof("It will fire after %v.", nextFire.Sub(currentTime))

	return job
}
