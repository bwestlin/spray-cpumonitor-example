package se.bwestlin.cpumonitor.monitor


import java.lang.management.ManagementFactory

import com.sun.management.OperatingSystemMXBean
import se.bwestlin.cpumonitor.model.CpuUsage
import se.bwestlin.cpumonitor.monitor.CpuMonitor.Measure

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.{Props, Actor, ActorLogging}

object CpuMonitor {

  case class Measure()

  def props() = {
    Props(classOf[CpuMonitor])
  }
}

class CpuMonitor extends Actor with ActorLogging {

  val mbsc = ManagementFactory.getPlatformMBeanServer
  val osMBean = ManagementFactory.newPlatformMXBeanProxy(mbsc, ManagementFactory.OPERATING_SYSTEM_MXBEAN_NAME, classOf[OperatingSystemMXBean])

  val measureInterval = 1000.millisecond
  val measure = context.system.scheduler.schedule(measureInterval, measureInterval, self, Measure())

  def receive = {
    case Measure() => {
      val processCpuLoad = osMBean.getProcessCpuLoad
      val systemCpuLoad = osMBean.getSystemCpuLoad
      val cpuUsage = CpuUsage(processCpuLoad, systemCpuLoad)

      context.system.eventStream.publish(cpuUsage)
    }
  }
}
