# Prerequisites. Step 0. 
(not on drawing)
If the user selects data and copies it, the application with the selected data will notify the compositor with the fact that it now has data available.  The actual copy is lazy: the data stays in the program, the program just notifies that it has data that can be copied.

The app will send this information including a list of mime-types, so for example, text can be sent in multiple formats like plain text for programs that do not support formatting and a second format with formatting.

Upon receiving this data, the compositor will then broadcast this information to all other programs, so all other programs will know a) there is something available that can be copied and b) which mimetypes that are supported

# 1) 
The application 0 wants to paste: it will
create a file descriptor where the paste data will be written to.  The
application will send this file descriptor to the proxy compositor 0, asking please write the paste-buffer to this fd

In this message the mimetype is included: the application already knew there was a paste buffer and knew which mimetypes were available.  It will have chosen which mimetype is most relevant for the app 0 and include this mimetype in the request contents of paste buffer request

#2) 
The greenfield proxy 0 will receive the message from the app 0, including a filedescriptor.  It will create a web url so other applications can connect to this proxy 0 to write the data to.  This information, the websocket URL and the mimetype will be sent to the compositor within the message "Request contents of paste buffer

#3). 
The compositor will know which app is the owner of the paste buffer and will forward the message to start sending the data, including the mimetype and web-url information.

#4). 
The greenfield wayland proxy 1 of the application 1 that has the paste buffer will receive the message.
It will create a new FD and forward the message with this FD and the mimetype so the application 1 can write to the FD

#5) 
The application 1 that has the paste data will start writing the paste buffer to the FD that has been received.  When all data is written, the file descriptor is closed again, the FD is for this application write-only.

#6)
In step 4, the proxy 1 created an FD. This FD is now wrapped into a websocket, the proxy will now connect to the URL which it received from the compositor.  This url is the url of the receiving proxy, which controls the application requesting the data.  After the connection has been established, the proxy 1 will copy all data read from app 1 to the websocket


#7) 
Proxy 0 receives the data over the websocket and copies the data over the local filedescriptor so app 0 receives the data
 

Special cases:
If the proxy 0 and proxy 1 are the same proxy (copy paste between the same app or 2 apps started by the same proxy, the proxy can make an optimization by directly passing on the filedescriptor, skipping creating a websocket
