package se.bwestlin.cpumonitor.model

import spray.json._

object JsonProtocol extends DefaultJsonProtocol {

  implicit val cpuUsageFormat = jsonFormat2(CpuUsage)

}
