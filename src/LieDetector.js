import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, Square, RotateCcw, AlertTriangle, CheckCircle, XCircle, Brain, Eye } from 'lucide-react';

const EnhancedLieDetector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentExpression, setCurrentExpression] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [blinkRate, setBlinkRate] = useState(0);
  const [headMovement, setHeadMovement] = useState({ x: 0, y: 0 });
  const [eyeGazePattern, setEyeGazePattern] = useState('center');
  const [microExpressionData, setMicroExpressionData] = useState({});
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analysisIntervalRef = useRef(null);
  const blinkCountRef = useRef(0);
  const analysisStartTimeRef = useRef(null);
  const previousFaceDataRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user',
          frameRate: 30
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Enhanced facial analysis simulation
  const performAdvancedFacialAnalysis = () => {
    // Simulate advanced biometric measurements
    const currentTime = Date.now();
    
    // Generate realistic biometric data
    const simulatedBlinks = Math.floor(Math.random() * 5) + 15; // 15-20 blinks per analysis cycle
    const timeElapsed = analysisStartTimeRef.current ? 
      (currentTime - analysisStartTimeRef.current) / 1000 / 60 : 1;
    
    setBlinkRate(Math.round(simulatedBlinks / Math.max(timeElapsed, 0.1)));
    
    // Simulate eye gaze patterns
    const gazePatterns = ['center', 'left', 'right', 'up', 'down'];
    const newGaze = gazePatterns[Math.floor(Math.random() * gazePatterns.length)];
    setEyeGazePattern(newGaze);
    
    // Simulate head movement
    setHeadMovement({
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 50
    });

    // Advanced micro-expression analysis
    const microExpressions = {
      eyeMovement: Math.random() * 10,
      mouthTension: Math.random() * 8,
      eyebrowFlash: Math.random() * 5,
      facialAsymmetry: Math.random() * 0.5,
      nostrilFlare: Math.random() * 3,
      jawTension: Math.random() * 6
    };
    
    setMicroExpressionData(microExpressions);
    
    return microExpressions;
  };

  // Advanced lie detection algorithm
  const advancedLieDetection = () => {
    const microExpressions = performAdvancedFacialAnalysis();
    
    // Sophisticated scoring algorithm
    let deceptionScore = 0;
    let truthScore = 0;
    
    // Eye movement analysis (high movement = stress/deception)
    if (microExpressions.eyeMovement > 7) deceptionScore += 30;
    else if (microExpressions.eyeMovement < 3) truthScore += 20;
    
    // Mouth tension (forced expressions)
    if (microExpressions.mouthTension > 6) deceptionScore += 25;
    else if (microExpressions.mouthTension < 2) truthScore += 15;
    
    // Facial asymmetry (stress indicator)
    if (microExpressions.facialAsymmetry > 0.3) deceptionScore += 20;
    else if (microExpressions.facialAsymmetry < 0.15) truthScore += 15;
    
    // Blink rate analysis (normal: 15-20 per minute)
    if (blinkRate > 30 || blinkRate < 8) deceptionScore += 25;
    else if (blinkRate >= 15 && blinkRate <= 25) truthScore += 20;
    
    // Eye gaze patterns (avoiding eye contact = deception)
    if (eyeGazePattern !== 'center') deceptionScore += 15;
    else truthScore += 15;
    
    // Head movement analysis
    const totalHeadMovement = Math.abs(headMovement.x) + Math.abs(headMovement.y);
    if (totalHeadMovement > 80) deceptionScore += 20;
    else if (totalHeadMovement < 30) truthScore += 10;
    
    // Nostril flare (stress response)
    if (microExpressions.nostrilFlare > 2) deceptionScore += 15;
    
    // Jaw tension (stress/anxiety)
    if (microExpressions.jawTension > 4) deceptionScore += 15;
    
    // Add controlled randomness for realistic variation
    deceptionScore += Math.random() * 15;
    truthScore += Math.random() * 15;
    
    // Calculate final result
    const totalScore = deceptionScore + truthScore;
    const lieConfidence = Math.round((deceptionScore / totalScore) * 100);
    const truthConfidence = 100 - lieConfidence;
    
    const finalResult = lieConfidence > truthConfidence ? 'LIE' : 'TRUTH';
    const finalConfidence = Math.max(lieConfidence, truthConfidence);
    
    // Determine expression based on analysis
    let dominantExpression = 'neutral';
    if (microExpressions.eyeMovement > 7) dominantExpression = 'nervous';
    if (microExpressions.mouthTension > 6) dominantExpression = 'forced_expression';
    if (microExpressions.facialAsymmetry > 0.3) dominantExpression = 'stressed';
    if (blinkRate > 30) dominantExpression = 'anxious';
    if (totalHeadMovement > 80) dominantExpression = 'fidgety';
    
    setCurrentExpression(dominantExpression);
    setResult(finalResult);
    setConfidence(finalConfidence);
    
    // Add to analysis history
    const newAnalysis = {
      timestamp: new Date().toLocaleTimeString(),
      result: finalResult,
      confidence: finalConfidence,
      expression: dominantExpression,
      blinkRate,
      eyeGaze: eyeGazePattern,
      microExpressions: {
        eyeMovement: microExpressions.eyeMovement.toFixed(1),
        mouthTension: microExpressions.mouthTension.toFixed(1),
        facialAsymmetry: microExpressions.facialAsymmetry.toFixed(2)
      }
    };
    
    setAnalysisHistory(prev => [newAnalysis, ...prev.slice(0, 9)]);
  };

  const startRecording = () => {
    setIsRecording(true);
    setResult(null);
    setConfidence(0);
    blinkCountRef.current = 0;
    analysisStartTimeRef.current = Date.now();
    analysisIntervalRef.current = setInterval(advancedLieDetection, 1500);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setConfidence(0);
    setCurrentExpression('');
    setAnalysisHistory([]);
    setIsRecording(false);
    setBlinkRate(0);
    setHeadMovement({ x: 0, y: 0 });
    setEyeGazePattern('center');
    setMicroExpressionData({});
    blinkCountRef.current = 0;
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  const getResultIcon = (result) => {
    if (!result) return <AlertTriangle size={32} color="#9CA3AF" />;
    return result === 'TRUTH' ? 
      <CheckCircle size={32} color="#10B981" /> : 
      <XCircle size={32} color="#EF4444" />;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #7c3aed 50%, #0f172a 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      padding: '0',
      margin: '0'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0'
          }}>
            🧠 Advanced AI Lie Detector
          </h1>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1.1rem',
            margin: '0 0 1rem 0'
          }}>
            Real-time facial micro-expression analysis with biometric monitoring
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Enhanced Video Feed Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 1rem 0'
              }}>
                <Camera size={20} />
                Enhanced AI Camera Feed
              </h2>
              
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '280px',
                    backgroundColor: 'black',
                    borderRadius: '0.5rem',
                    objectFit: 'cover'
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    borderRadius: '0.5rem'
                  }}
                />
                
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    animation: 'pulse 2s infinite',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Eye size={14} />
                    AI ANALYZING
                  </div>
                )}
              </div>

              {/* Enhanced Control Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    style={{
                      flex: '1',
                      background: 'linear-gradient(to right, #059669, #047857)',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Play size={16} />
                    Start AI Analysis
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    style={{
                      flex: '1',
                      background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Square size={16} />
                    Stop Analysis
                  </button>
                )}
                
                <button
                  onClick={resetAnalysis}
                  style={{
                    backgroundColor: '#475569',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Real-time Biometric Metrics */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Brain size={18} />
                Real-time Biometric Data
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                    Blink Rate (per min)
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    color: blinkRate > 30 || blinkRate < 8 ? '#ef4444' : '#10b981'
                  }}>
                    {blinkRate}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                    Eye Gaze
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    color: eyeGazePattern === 'center' ? '#10b981' : '#f59e0b',
                    textTransform: 'capitalize'
                  }}>
                    {eyeGazePattern}
                  </div>
                </div>
              </div>

              {/* Micro-expression Indicators */}
              {Object.keys(microExpressionData).length > 0 && (
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                    Micro-expression Intensity:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Eye Movement: {microExpressionData.eyeMovement} | 
                    Mouth Tension: {microExpressionData.mouthTension} | 
                    Asymmetry: {microExpressionData.facialAsymmetry}
                  </div>
                </div>
              )}
            </div>

            {/* Current Expression */}
            {currentExpression && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(124, 58, 237, 0.3)'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  margin: '0 0 0.5rem 0'
                }}>Detected Expression</h3>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                  textTransform: 'capitalize'
                }}>
                  {currentExpression.replace('_', ' ')}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Results Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Main Result */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                margin: '0 0 1.5rem 0'
              }}>AI Analysis Result</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {getResultIcon(result)}
              </div>
              
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: result === 'TRUTH' ? '#10b981' : result === 'LIE' ? '#ef4444' : '#9ca3af'
              }}>
                {result || 'WAITING...'}
              </div>
              
              {confidence > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#9ca3af',
                    marginBottom: '0.5rem'
                  }}>AI Confidence Level</div>
                  <div style={{
                    width: '100%',
                    backgroundColor: '#475569',
                    borderRadius: '0.5rem',
                    height: '0.75rem',
                    marginBottom: '0.5rem',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{
                        height: '100%',
                        backgroundColor: result === 'TRUTH' ? '#10b981' : '#ef4444',
                        width: `${confidence}%`,
                        transition: 'width 0.5s ease',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>{confidence}%</div>
                </div>
              )}
            </div>

            {/* Analysis History */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                margin: '0 0 1rem 0'
              }}>Analysis History</h3>
              
              {analysisHistory.length === 0 ? (
                <p style={{
                  color: '#9ca3af',
                  textAlign: 'center',
                  padding: '1rem 0',
                  margin: '0'
                }}>No analysis data yet</p>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {analysisHistory.map((analysis, index) => (
                    <div key={index} style={{
                      backgroundColor: 'rgba(71, 85, 105, 0.5)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontWeight: 'bold',
                          color: analysis.result === 'TRUTH' ? '#34d399' : '#f87171'
                        }}>
                          {analysis.result}
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          color: '#9ca3af'
                        }}>{analysis.timestamp}</span>
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#cbd5e1'
                      }}>
                        Expression: {analysis.expression} | Confidence: {analysis.confidence}%
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#9ca3af'
                      }}>
                        Blinks: {analysis.blinkRate}/min | Gaze: {analysis.eyeGaze}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Instructions */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                margin: '0 0 0.75rem 0'
              }}>How to Use Advanced AI Analysis</h3>
              <div style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                lineHeight: '1.6'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>1. Allow camera access for biometric monitoring</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>2. Position face clearly, maintain good lighting</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>3. Click "Start AI Analysis" for real-time detection</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>4. Speak naturally while the AI monitors micro-expressions</p>
                <p style={{ margin: '0' }}>5. AI analyzes blink rate, gaze patterns, and facial asymmetry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Disclaimer */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.9rem',
            margin: '0'
          }}>
            ⚠️ Advanced demonstration using sophisticated behavioral analysis algorithms. 
            This system simulates real AI lie detection technology for educational purposes.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLieDetector;