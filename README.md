# Spray.io CPU Monitor Example #

This is an example application demonstrating showing host CPU usage on a webpage using a
[websocket](http://en.wikipedia.org/wiki/WebSocket).

**It's currently a work in progress...**

It shows the total system CPU usage and the JVM-process CPU usage the last 120 seconds for the host it runs on.

To see it in action now go here: [http://cpumon.herokuapp.com/](http://cpumon.herokuapp.com/)
It's running on [Heroku](https://www.heroku.com/) which will have the consequence of showing the total system CPU
usage for the server being affected by other unknown applications.

To trigger the JVM-process CPU usage to increase the following could be used to trigger it:
```
ab -k -c 10 -n 100 http://cpumon.herokuapp.com/
```
*Please be gentle though doing this since it's not very nice to [Heroku](https://www.heroku.com/)*

The following were used building this example:
* [scala](http://www.scala-lang.org/)
* [spray.io](http://spray.io/)
* [spray-websocket](https://github.com/wandoulabs/spray-websocket)
* [angularjs](https://angularjs.org/)
* [n3-charts](https://github.com/n3-charts/line-chart)

                                                                                                                                                                                                                                   
## Running ##
                                                                                                                                                                                                                      
The easiest way to run this application is with the following command in the base directory:                                                                                                                                    
```                                                                                                                                                                                                                                
./activator run
```                                                                                                                                                                                                                                
After this it can be accessed from a web browser at **http://localhost:8080/**.                                                              
                                                                                                                                                                                                                                   

## Licence ##

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Copyright &copy; 2014- Björn Westlin.

