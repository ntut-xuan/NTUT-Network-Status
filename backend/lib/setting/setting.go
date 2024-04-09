package settingLib

import (
	"encoding/json"
	"io"
	"os"

	log "github.com/sirupsen/logrus"
)

type Setting struct {
	Mode string `json:"mode"`
}

func LoadSetting(settingFile *os.File) (Setting, error){
	byteValue, err := io.ReadAll(settingFile)

	if err != nil {
		log.Error("Error on loading the setting.")
		return Setting{}, err
	}

	var setting Setting;
	err = json.Unmarshal(byteValue, &setting)

	log.Info("Successfully loading the setting files.")
	log.Infof("The currect mode is %s.", setting.Mode)

	return setting, err;
}