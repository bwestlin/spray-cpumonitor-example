package se.bwestlin.cpumonitor.monitor


import se.bwestlin.cpumonitor.http.BroadcastWS
import se.bwestlin.cpumonitor.model.CpuUsage

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.{Props, Actor, ActorLogging}
import org.hyperic.sigar.Sigar

object CpuMonitor {

  case class Measure()

  def props() = {
    Props(classOf[CpuMonitor])
  }
}

class CpuMonitor extends Actor with ActorLogging {
  import se.bwestlin.cpumonitor.monitor.CpuMonitor.Measure

  val sigar = new Sigar()

  val measureInterval = 1000.millisecond
  val measure = context.system.scheduler.schedule(measureInterval, measureInterval, self, Measure())

  def receive = {
    case Measure() => {
      val cpuPerc = sigar.getCpuPerc
      val cpuUsage = CpuUsage(cpuPerc.getUser, cpuPerc.getSys)

      context.system.eventStream.publish(cpuUsage)
    }
  }
}
