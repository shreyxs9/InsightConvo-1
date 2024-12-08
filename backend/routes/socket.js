const express = require("express");
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = require("wrtc");  // Import wrtc
const router = express.Router();

let peerConnections = {}; // Store peer connections by socket ID

// Handle WebRTC offer and return the answer
router.post("/offer", async (req, res) => {
  const { offer } = req.body;

  try {
    // Create a new peer connection
    const peerConnection = new RTCPeerConnection();

    // Set remote description with the offer received from the client
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create an answer to the offer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Return the answer to the client
    res.status(200).json({ answer });

    // Store the peer connection (if needed for ICE candidates)
    peerConnections[req.socket.id] = peerConnection;

    // Handle track event (if using media streams)
    peerConnection.ontrack = (event) => {
      console.log("Track received:", event.streams[0]);
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "disconnected") {
        console.log("Peer disconnected");
        delete peerConnections[req.socket.id];
      }
    };

  } catch (error) {
    console.error("Error handling offer:", error);
    res.status(500).json({ error: "Failed to process offer" });
  }
});

// Handle incoming ICE candidates
router.post("/ice-candidate", (req, res) => {
  const { candidate } = req.body;

  try {
    const peerConnection = peerConnections[req.socket.id];
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Peer connection not found" });
    }
  } catch (error) {
    console.error("Error handling ICE candidate:", error);
    res.status(500).json({ error: "Failed to process ICE candidate" });
  }
});

module.exports = router;
