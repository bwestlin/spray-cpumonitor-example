import com.typesafe.sbt.SbtNativePackager._
import NativePackagerKeys._

name := """spray-cpumonitor"""

version := "1.0"

scalaVersion := "2.11.4"

resolvers ++= Seq(
  "spray repo" at "http://repo.spray.io",
  "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"
)

libraryDependencies ++= Seq(
  "ch.qos.logback"      %   "logback-classic"   % "1.1.2",
  "com.wandoulabs.akka" %%  "spray-websocket"   % "0.1.3",
  "io.spray"            %%  "spray-json"        % "1.2.6",
  "com.typesafe.akka"   %%  "akka-slf4j"        % "2.3.6",
  "commons-io"          %   "commons-io"        % "2.4",
  "joda-time"           %   "joda-time"         % "2.5" withSources(),
  "org.joda"            %   "joda-convert"      % "1.7",
  "io.spray"            %%  "spray-json"        % "1.2.6",
  "org.webjars"         %   "jquery"            % "2.1.1",
  "org.webjars"         %   "lodash"            % "2.4.1-6",
  "org.webjars"         %   "bootstrap"         % "3.3.1",
  "org.webjars"         %   "font-awesome"      % "4.2.0",
  "org.webjars"         %   "angularjs"         % "1.3.2",
  "org.webjars"         %   "d3js"              % "3.4.13",
  "org.scalatest"       %%  "scalatest"         % "2.1.6" % "test"
)
                                                                                                                                                                                                                                             
Revolver.settings

javaOptions in Revolver.reStart += "-Djava.library.path=./native"
                                                                                                                                                                                                                                             
packageArchetype.java_application

javaOptions in run += "-Djava.library.path=/home/weez/Egna_projekt/spray/spray-cpumonitor/native"