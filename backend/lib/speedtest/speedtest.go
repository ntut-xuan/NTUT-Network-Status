package speedTestLib

import (
	"github.com/showwin/speedtest-go/speedtest"
	log "github.com/sirupsen/logrus"
)

func FetchServer(client *speedtest.Speedtest) (speedtest.Servers, error) {
	servers, err := client.FetchServers()

	if err != nil {
		log.Error("Error on fetch server")
		return servers, err
	}

	log.Infof("Successful fetch %d servers.", servers.Len())
	return servers, nil
}

func FindServer(serverList speedtest.Servers, serverIDs []int) (speedtest.Servers, error) {
	target, err := serverList.FindServer(serverIDs)

	if err != nil {
		log.Error("Error on find server")
		return target, err
	}

	log.Infof("Successful find %d servers.", target.Len())
	return target, nil
}
