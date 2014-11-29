package se.bwestlin.cpumonitor

import se.bwestlin.cpumonitor.monitor.CpuMonitor

import scala.concurrent.duration._
import akka.actor._
import akka.io.IO
import akka.util.Timeout
import akka.pattern.ask
import se.bwestlin.cpumonitor.http.{WSBroadcaster, HttpServer}
import spray.can.Http
import spray.can.server.UHttp

object Main {

  def main(args: Array[String]): Unit = {

    implicit val system = ActorSystem()

    val server = system.actorOf(HttpServer.props(), "http")

    val port = Option(System.getProperty("http.port")).map(_.toInt).getOrElse(8080)

    implicit val timeout = Timeout(5 seconds)
    // Ask instead of tell to avoid dead-letters
    IO(UHttp) ? Http.Bind(server, "0.0.0.0", port)

    val cpuMonitor = system.actorOf(CpuMonitor.props(), "cpumonitor")

    val wsBroadcaster = system.actorOf(WSBroadcaster.props(), "wsbroadcaster")

  }
}
