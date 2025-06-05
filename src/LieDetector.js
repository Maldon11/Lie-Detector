import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, Square, RotateCcw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const LieDetector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentExpression, setCurrentExpression] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analysisIntervalRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
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

  // Simulate facial expression analysis
  const analyzeFacialExpressions = () => {
    const expressions = [
      'neutral', 'happy', 'surprised', 'angry', 'fearful', 
      'disgusted', 'sad', 'contemptuous'
    ];
    
    const microExpressions = [
      'eye_movement', 'lip_tension', 'eyebrow_flash', 
      'nostril_flare', 'jaw_clench', 'forced_smile'
    ];

    const dominantExpression = expressions[Math.floor(Math.random() * expressions.length)];
    const detectedMicroExpression = microExpressions[Math.floor(Math.random() * microExpressions.length)];
    
    const deceptionIndicators = ['eye_movement', 'lip_tension', 'forced_smile', 'nostril_flare'];
    const truthIndicators = ['neutral', 'happy', 'eyebrow_flash'];
    
    let lieScore = 0;
    let truthScore = 0;
    
    if (deceptionIndicators.includes(detectedMicroExpression)) lieScore += 40;
    if (dominantExpression === 'fearful' || dominantExpression === 'surprised') lieScore += 30;
    if (dominantExpression === 'contemptuous' || dominantExpression === 'disgusted') lieScore += 25;
    
    if (truthIndicators.includes(dominantExpression)) truthScore += 35;
    if (dominantExpression === 'neutral') truthScore += 20;
    
    lieScore += Math.random() * 20;
    truthScore += Math.random() * 20;
    
    const totalScore = lieScore + truthScore;
    const lieConfidence = Math.round((lieScore / totalScore) * 100);
    const truthConfidence = 100 - lieConfidence;
    
    const finalResult = lieConfidence > truthConfidence ? 'LIE' : 'TRUTH';
    const finalConfidence = Math.max(lieConfidence, truthConfidence);
    
    setCurrentExpression(dominantExpression);
    setResult(finalResult);
    setConfidence(finalConfidence);
    
    const newAnalysis = {
      timestamp: new Date().toLocaleTimeString(),
      result: finalResult,
      confidence: finalConfidence,
      expression: dominantExpression,
      microExpression: detectedMicroExpression
    };
    
    setAnalysisHistory(prev => [newAnalysis, ...prev.slice(0, 9)]);
  };

  const startRecording = () => {
    setIsRecording(true);
    setResult(null);
    setConfidence(0);
    analysisIntervalRef.current = setInterval(analyzeFacialExpressions, 2000);
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
      background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      padding: '0',
      margin: '0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #60A5FA, #A78BFA)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0'
          }}>
            AI Lie Detector
          </h1>
          <p style={{
            color: '#CBD5E1',
            fontSize: '1.1rem',
            margin: '0'
          }}>
            Advanced facial expression analysis for truth detection
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Video Feed Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #475569'
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
                Live Camera Feed
              </h2>
              
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '250px',
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
                    pointerEvents: 'none'
                  }}
                />
                
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    animation: 'pulse 2s infinite'
                  }}>
                    ANALYZING
                  </div>
                )}
              </div>

              {/* Control Buttons */}
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
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #047857, #065f46)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #059669, #047857)';
                    }}
                  >
                    <Play size={16} />
                    Start Analysis
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    style={{
                      flex: '1',
                      background: 'linear-gradient(to right, #DC2626, #B91C1C)',
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
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #B91C1C, #991B1B)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #DC2626, #B91C1C)';
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
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#334155';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#475569';
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Current Expression */}
            {currentExpression && (
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #475569'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  margin: '0 0 0.5rem 0'
                }}>Current Expression</h3>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#60A5FA',
                  textTransform: 'capitalize'
                }}>
                  {currentExpression.replace('_', ' ')}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Main Result */}
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #475569',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                margin: '0 0 1.5rem 0'
              }}>Analysis Result</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {getResultIcon(result)}
              </div>
              
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: result === 'TRUTH' ? '#10B981' : result === 'LIE' ? '#EF4444' : '#9CA3AF'
              }}>
                {result || 'WAITING...'}
              </div>
              
              {confidence > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#9CA3AF',
                    marginBottom: '0.5rem'
                  }}>Confidence Level</div>
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
                        backgroundColor: result === 'TRUTH' ? '#10B981' : '#EF4444',
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
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #475569'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                margin: '0 0 1rem 0'
              }}>Analysis History</h3>
              
              {analysisHistory.length === 0 ? (
                <p style={{
                  color: '#9CA3AF',
                  textAlign: 'center',
                  padding: '1rem 0',
                  margin: '0'
                }}>No analysis data yet</p>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  maxHeight: '250px',
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
                          color: analysis.result === 'TRUTH' ? '#34D399' : '#F87171'
                        }}>
                          {analysis.result}
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          color: '#9CA3AF'
                        }}>{analysis.timestamp}</span>
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#CBD5E1'
                      }}>
                        Expression: {analysis.expression} | Confidence: {analysis.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #475569'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                margin: '0 0 0.75rem 0'
              }}>How to Use</h3>
              <div style={{
                fontSize: '0.9rem',
                color: '#CBD5E1',
                lineHeight: '1.6'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>1. Allow camera access when prompted</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>2. Position your face clearly in the camera frame</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>3. Click "Start Analysis" to begin lie detection</p>
                <p style={{ margin: '0 0 0.5rem 0' }}>4. Speak or think about your statement while being analyzed</p>
                <p style={{ margin: '0' }}>5. The AI will analyze your micro-expressions in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{
            color: '#9CA3AF',
            fontSize: '0.9rem',
            margin: '0'
          }}>
            ⚠️ This is a demonstration using simulated analysis. 
            Real lie detection requires advanced ML models and should not be used for serious decisions.
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

export default LieDetector;