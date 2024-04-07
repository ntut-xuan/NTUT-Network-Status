package speedTestLib

import (
	"github.com/showwin/speedtest-go/speedtest"
	log "github.com/sirupsen/logrus"
)

func FetchServer(client *speedtest.Speedtest) speedtest.Servers {
	servers, err := client.FetchServers()

	if err != nil {
		log.Fatal("Error on fetch server: ", err)
		panic(err)
	}

	log.Infof("Successful fetch %d servers.", servers.Len())
	return servers
}

func FindServer(serverList speedtest.Servers, serverIDs []int) speedtest.Servers {
	target, err := serverList.FindServer(serverIDs)

	if err != nil {
		log.Fatal("Error on find server: ", err)
		panic(err)
	}

	log.Infof("Successful find %d servers.", target.Len())
	return target
}
