package se.bwestlin.cpumonitor.http

import akka.actor.{Props, ActorLogging, Actor}
import se.bwestlin.cpumonitor.model.CpuUsage
import se.bwestlin.cpumonitor.model.JsonProtocol._
import spray.json._

object WSBroadcaster {
  def props() = {
    Props(classOf[WSBroadcaster])
  }
}

class WSBroadcaster extends Actor with ActorLogging {

  context.system.eventStream.subscribe(self, classOf[CpuUsage])

  def receive = {
    case cpuUsage: CpuUsage => {
      context.system.eventStream.publish(BroadcastWS(cpuUsage.toJson.toString()))
    }
  }
}
