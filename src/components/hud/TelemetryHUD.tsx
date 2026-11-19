import { useEffect, useState } from "react";
import { Volume2, VolumeX, Eye, Shield, Compass } from "lucide-react";

interface TelemetryHUDProps {
  scrollProgress: number;
  activeStage: number;
  stageName: string;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  liteMode: boolean;
  onToggleLiteMode: () => void;
}

export function TelemetryHUD({
  scrollProgress,
  activeStage,
  stageName,
  isAudioActive,
  onToggleAudio,
  liteMode,
  onToggleLiteMode,
}: TelemetryHUDProps) {
  const [timecode, setTimecode] = useState("00:00:00:00");

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 24;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const ff = String(frame).padStart(2, "0");
      setTimecode(`${hh}:${mm}:${ss}:${ff}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  const depthZ = (16 - scrollProgress * 165).toFixed(1);
  const focalLength = scrollProgress < 0.25 ? "35mm" : scrollProgress < 0.65 ? "50mm" : "85mm";
  const percentInt = Math.min(100, Math.max(0, Math.round(scrollProgress * 100)));

  return (
    <aside className="telemetry-hud" aria-label="Cinematic Telemetry HUD">
      {/* Top Left: Timecode & Camera Optical Specs */}
      <div className="telemetry-corner top-left">
        <div className="hud-line">
          <span className="hud-label">REC TC</span>
          <span className="hud-value font-mono">{timecode}</span>
        </div>
        <div className="hud-line">
          <span className="hud-label">OPTICS</span>
          <span className="hud-value font-mono">{focalLength} · T1.5 · 180.0°</span>
        </div>
        <div className="hud-line">
          <span className="hud-label">FORMAT</span>
          <span className="hud-value font-mono">2.39:1 ANAMORPHIC RAW</span>
        </div>
      </div>

      {/* Top Right: Spatial Depth & Chamber Status */}
      <div className="telemetry-corner top-right">
        <div className="hud-line">
          <span className="hud-label">CHAMBER</span>
          <span className="hud-value hud-glow">0{activeStage + 1} // {stageName}</span>
        </div>
        <div className="hud-line">
          <span className="hud-label">DEPTH_Z</span>
          <span className="hud-value font-mono">{depthZ}m</span>
        </div>
        <div className="hud-line">
          <span className="hud-label">TRANSIT</span>
          <div className="hud-progress-bar">
            <div className="hud-progress-fill" style={{ width: `${percentInt}%` }} />
          </div>
          <span className="hud-value font-mono">{String(percentInt).padStart(3, "0")}%</span>
        </div>
      </div>

      {/* Bottom Left: Spatial Controls & Environment Toggles */}
      <div className="telemetry-corner bottom-left">
        <button
          type="button"
          onClick={onToggleAudio}
          className={`hud-toggle-btn ${isAudioActive ? "active" : ""}`}
          title={isAudioActive ? "Mute Ambient Drone" : "Activate Cinematic Ambient Drone"}
        >
          {isAudioActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>AUDIO: {isAudioActive ? "LIVE" : "MUTE"}</span>
          {isAudioActive && <span className="audio-pulse-indicator" />}
        </button>

        <button
          type="button"
          onClick={onToggleLiteMode}
          className={`hud-toggle-btn ${liteMode ? "active" : ""}`}
          title="Toggle Lite Mode (Reduced Motion & Shader Load)"
        >
          <Eye size={14} />
          <span>LITE: {liteMode ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Bottom Right: Auteur Coordinates */}
      <div className="telemetry-corner bottom-right">
        <div className="hud-line">
          <Compass size={12} className="hud-icon" />
          <span className="hud-value font-mono">23.9999° N · 90.4203° E (GAZIPUR)</span>
        </div>
        <div className="hud-line">
          <Shield size={12} className="hud-icon" />
          <span className="hud-value font-mono">INFINITE CASTLE ENGINE v3.0</span>
        </div>
      </div>
    </aside>
  );
}
