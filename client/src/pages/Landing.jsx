"use client"
import {
  Check,
  Star,
  FileText,
  BarChart3,
  ArrowRight,
  Menu,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Target,
  Palette,
  Eye,
  Sparkles,
  Zap,
  Shield,
  Cpu,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom' // ✅ Added for routing

export default function ResumeForge() {
  const [scrolled, setScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [floating3DObjects, setFloating3DObjects] = useState([])
  const particleIdRef = useRef(0)
  const objectIdRef = useRef(0)

  const navigate = useNavigate()

  const handleLoginNavigation = () => {
    navigate('/login')
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create trailing particles
      const newParticle = {
        id: particleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        size: Math.random() * 4 + 2,
      }

      setParticles((prev) => [...prev.slice(-30), newParticle])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            opacity: particle.opacity - 0.03,
          }))
          .filter((particle) => particle.opacity > 0),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Initialize floating 3D objects
  useEffect(() => {
    const objects = Array.from({ length: 8 }).map(() => ({
      id: objectIdRef.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      rotateX: Math.random() * 360,
      rotateY: Math.random() * 360,
      rotateZ: Math.random() * 360,
      size: Math.random() * 60 + 40,
      type: Math.floor(Math.random() * 4), // 0: cube, 1: sphere, 2: pyramid, 3: torus
    }))
    setFloating3DObjects(objects)

    const animateObjects = () => {
      setFloating3DObjects((prev) =>
        prev.map((obj) => ({
          ...obj,
          rotateX: obj.rotateX + 0.5,
          rotateY: obj.rotateY + 0.3,
          rotateZ: obj.rotateZ + 0.2,
          y: obj.y + Math.sin(Date.now() * 0.001 + obj.id) * 0.1,
        })),
      )
    }

    const animationInterval = setInterval(animateObjects, 50)
    return () => clearInterval(animationInterval)
  }, [])

  // Inline styles object
  const styles = {
    // Base styles
    minHeight: "100vh",
    backgroundColor: "#0d1117",
    color: "#f0f6fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // Interactive background
    interactiveBackground: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
      background: "radial-gradient(ellipse at center, #161b22 0%, #0d1117 70%)",
    },

    // Mouse following gradient
    mouseGradient: {
      position: "absolute",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      opacity: 0.15,
      filter: "blur(60px)",
      transition: "all 400ms ease-out",
      background: `radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, rgba(236, 72, 153, 0.2) 60%, transparent 80%)`,
      left: mousePosition.x - 300,
      top: mousePosition.y - 300,
    },

    // Particle styles
    particle: {
      position: "absolute",
      borderRadius: "50%",
      background: "linear-gradient(45deg, #38bdf8, #8b5cf6, #ec4899)",
      pointerEvents: "none",
      transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
      boxShadow: "0 0 10px rgba(56, 189, 248, 0.5)",
    },

    // 3D Objects
    floating3DObject: {
      position: "absolute",
      pointerEvents: "none",
      transformStyle: "preserve-3d",
      transition: "transform 0.1s ease-out",
    },

    cube3D: {
      width: "100%",
      height: "100%",
      background: "linear-gradient(45deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))",
      border: "1px solid rgba(56, 189, 248, 0.2)",
      borderRadius: "8px",
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)",
    },

    sphere3D: {
      width: "100%",
      height: "100%",
      background: "radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.1))",
      borderRadius: "50%",
      border: "1px solid rgba(236, 72, 153, 0.3)",
      boxShadow: "0 0 25px rgba(236, 72, 153, 0.4)",
    },

    pyramid3D: {
      width: 0,
      height: 0,
      borderLeft: "50px solid transparent",
      borderRight: "50px solid transparent",
      borderBottom: "80px solid rgba(56, 189, 248, 0.15)",
      filter: "drop-shadow(0 0 15px rgba(56, 189, 248, 0.4))",
    },

    // Static background elements
    staticGlow1: {
      position: "absolute",
      top: "10%",
      left: "5%",
      width: "400px",
      height: "400px",
      background: "radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(40px)",
      animation: "float 8s ease-in-out infinite",
    },

    staticGlow2: {
      position: "absolute",
      top: "60%",
      right: "10%",
      width: "300px",
      height: "300px",
      background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(40px)",
      animation: "float 10s ease-in-out infinite reverse",
    },

    staticGlow3: {
      position: "absolute",
      bottom: "20%",
      left: "20%",
      width: "350px",
      height: "350px",
      background: "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(50px)",
      animation: "float 12s ease-in-out infinite",
    },

    // Grid pattern
    gridPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: "50px 50px",
      opacity: 0.5,
    },

    // Navbar styles
    navbar: {
      position: "fixed",
      top: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 50,
      transition: "all 300ms",
      width: scrolled ? "95%" : "90%",
      maxWidth: scrolled ? "1152px" : "1024px",
    },

    navbarInner: {
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(13, 17, 23, 0.8)",
      border: "1px solid rgba(56, 189, 248, 0.2)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(56, 189, 248, 0.1)",
    },

    navContent: {
      display: "flex",
      height: "64px",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
    },

    logo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    logoIcon: {
      display: "flex",
      height: "32px",
      width: "32px",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)",
    },

    logoText: {
      fontSize: "20px",
      fontWeight: "bold",
      background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },

    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
    },

    navLink: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#f0f6fc",
      textDecoration: "none",
      transition: "all 200ms",
      cursor: "pointer",
      position: "relative",
    },

    navButtons: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },

    // Button styles
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 300ms ease-in-out",
      cursor: "pointer",
      border: "none",
      textDecoration: "none",
      position: "relative",
      overflow: "hidden",
    },

    buttonPrimary: {
      background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
      color: "white",
      padding: "10px 20px",
      transform: "scale(1)",
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
    },

    buttonPrimaryHover: {
      background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
      transform: "scale(1.05) translateY(-2px)",
      boxShadow: "0 10px 40px rgba(56, 189, 248, 0.4)",
    },

    buttonSecondary: {
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      backdropFilter: "blur(10px)",
      color: "#f0f6fc",
      padding: "10px 20px",
      border: "1px solid rgba(56, 189, 248, 0.3)",
    },

    buttonSecondaryHover: {
      backgroundColor: "rgba(56, 189, 248, 0.2)",
      borderColor: "rgba(56, 189, 248, 0.5)",
      transform: "scale(1.05) translateY(-2px)",
      boxShadow: "0 10px 30px rgba(56, 189, 248, 0.2)",
    },

    buttonLarge: {
      fontSize: "18px",
      padding: "16px 32px",
    },

    // Section styles
    section: {
      position: "relative",
      zIndex: 10,
    },

    heroSection: {
      paddingTop: "140px",
      paddingBottom: "100px",
      background:
        "linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(22, 27, 34, 0.8) 50%, rgba(13, 17, 23, 0.9) 100%)",
      position: "relative",
      zIndex: 10,
      overflow: "hidden",
    },

    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 16px",
    },

    heroGrid: {
      display: "grid",
      gap: "60px",
      alignItems: "center",
    },

    heroContent: {
      display: "flex",
      flexDirection: "column",
      gap: "40px",
    },

    heroText: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500",
      padding: "8px 16px",
      background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))",
      color: "#38bdf8",
      width: "fit-content",
      pointerEvents: "none",
      border: "1px solid rgba(56, 189, 248, 0.2)",
      boxShadow: "0 0 20px rgba(56, 189, 248, 0.1)",
    },

    heroTitle: {
      fontSize: "48px",
      fontWeight: "800",
      lineHeight: "1.1",
      pointerEvents: "none",
      userSelect: "none",
      textShadow: "0 0 30px rgba(56, 189, 248, 0.3)",
    },

    gradientText: {
      background: "linear-gradient(135deg, #38bdf8, #8b5cf6, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.3))",
    },

    heroDescription: {
      fontSize: "20px",
      color: "#8b949e",
      maxWidth: "600px",
      pointerEvents: "none",
      userSelect: "none",
      lineHeight: "1.6",
    },

    heroButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },

    heroFeatures: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
      fontSize: "14px",
      color: "#8b949e",
      pointerEvents: "none",
      flexWrap: "wrap",
    },

    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    heroImage: {
      position: "relative",
      pointerEvents: "none",
      transform: "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
      transition: "transform 0.3s ease",
    },

    heroImageGlow: {
      position: "absolute",
      top: "-20px",
      left: "-20px",
      right: "-20px",
      bottom: "-20px",
      background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))",
      borderRadius: "20px",
      filter: "blur(40px)",
      opacity: 0.6,
    },

    heroImageMain: {
      position: "relative",
      borderRadius: "16px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.1)",
      border: "1px solid rgba(56, 189, 248, 0.2)",
    },

    // Features section
    featuresSection: {
      padding: "100px 0",
      position: "relative",
      zIndex: 10,
      background: "linear-gradient(180deg, rgba(13, 17, 23, 0.8) 0%, rgba(22, 27, 34, 0.9) 100%)",
    },

    sectionHeader: {
      textAlign: "center",
      marginBottom: "80px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    sectionTitle: {
      fontSize: "42px",
      fontWeight: "800",
      lineHeight: "1.1",
      pointerEvents: "none",
      userSelect: "none",
      textShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
    },

    sectionDescription: {
      fontSize: "20px",
      color: "#8b949e",
      maxWidth: "800px",
      margin: "0 auto",
      pointerEvents: "none",
      userSelect: "none",
      lineHeight: "1.6",
    },

    featuresGrid: {
      display: "grid",
      gap: "32px",
    },

    featureCard: {
      backgroundColor: "rgba(22, 27, 34, 0.6)",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      transition: "all 400ms ease",
      cursor: "default",
      border: "1px solid rgba(56, 189, 248, 0.1)",
      backdropFilter: "blur(10px)",
      transform: "translateZ(0)",
    },

    featureCardHover: {
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.2)",
      transform: "translateY(-8px) translateZ(20px)",
      backgroundColor: "rgba(22, 27, 34, 0.8)",
    },

    featureIcon: {
      height: "60px",
      width: "60px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
      boxShadow: "0 0 30px rgba(56, 189, 248, 0.3)",
    },

    featureTitle: {
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "12px",
      pointerEvents: "none",
      color: "#f0f6fc",
    },

    featureDescription: {
      color: "#8b949e",
      lineHeight: "1.6",
      pointerEvents: "none",
    },

    // How it works section
    howItWorksSection: {
      padding: "100px 0",
      backgroundColor: "rgba(13, 17, 23, 0.95)",
      position: "relative",
      zIndex: 10,
    },

    stepsGrid: {
      display: "grid",
      gap: "40px",
    },

    step: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      pointerEvents: "none",
    },

    stepNumber: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "28px",
      fontWeight: "bold",
      margin: "0 auto",
      boxShadow: "0 0 40px rgba(56, 189, 248, 0.4)",
      border: "2px solid rgba(56, 189, 248, 0.3)",
    },

    stepTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#f0f6fc",
    },

    stepDescription: {
      color: "#8b949e",
      lineHeight: "1.6",
      fontSize: "16px",
    },

    // Templates section
    templatesSection: {
      padding: "100px 0",
      position: "relative",
      zIndex: 10,
      background: "linear-gradient(180deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.8) 100%)",
    },

    templatesGrid: {
      display: "grid",
      gap: "32px",
    },

    templateCard: {
      backgroundColor: "rgba(22, 27, 34, 0.6)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      transition: "all 400ms ease",
      cursor: "pointer",
      border: "1px solid rgba(56, 189, 248, 0.1)",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
      transform: "translateZ(0)",
    },

    templateImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      pointerEvents: "none",
      filter: "brightness(0.8) contrast(1.1)",
    },

    templateContent: {
      padding: "24px",
    },

    templateTitle: {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "8px",
      pointerEvents: "none",
      color: "#f0f6fc",
    },

    templateDescription: {
      color: "#8b949e",
      marginBottom: "20px",
      pointerEvents: "none",
    },

    templateButton: {
      width: "100%",
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      border: "1px solid rgba(56, 189, 248, 0.3)",
      color: "#f0f6fc",
      padding: "12px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 300ms",
      fontWeight: "500",
    },

    // Benefits section
    benefitsSection: {
      padding: "100px 0",
      background:
        "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)",
      color: "#f0f6fc",
      position: "relative",
      overflow: "hidden",
      zIndex: 10,
    },

    benefitsOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(13, 17, 23, 0.8)",
      pointerEvents: "none",
    },

    benefitsContent: {
      position: "relative",
      zIndex: 10,
    },

    benefitsBadge: {
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      color: "#38bdf8",
      border: "1px solid rgba(56, 189, 248, 0.3)",
      pointerEvents: "none",
    },

    benefitsGrid: {
      display: "grid",
      gap: "40px",
    },

    benefit: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      pointerEvents: "none",
    },

    benefitIcon: {
      width: "80px",
      height: "80px",
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
      border: "1px solid rgba(56, 189, 248, 0.3)",
      boxShadow: "0 0 30px rgba(56, 189, 248, 0.2)",
    },

    benefitTitle: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#f0f6fc",
    },

    benefitDescription: {
      color: "#8b949e",
      lineHeight: "1.6",
    },

    // Testimonials section
    testimonialsSection: {
      padding: "100px 0",
      position: "relative",
      zIndex: 10,
      backgroundColor: "rgba(13, 17, 23, 0.95)",
    },

    testimonialsGrid: {
      display: "grid",
      gap: "32px",
    },

    testimonialCard: {
      backgroundColor: "rgba(22, 27, 34, 0.6)",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      cursor: "default",
      border: "1px solid rgba(56, 189, 248, 0.1)",
      backdropFilter: "blur(10px)",
    },

    stars: {
      display: "flex",
      gap: "4px",
      marginBottom: "20px",
    },

    testimonialText: {
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "20px",
      pointerEvents: "none",
      color: "#f0f6fc",
    },

    testimonialAuthor: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      pointerEvents: "none",
    },

    authorImage: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "2px solid rgba(56, 189, 248, 0.3)",
    },

    authorName: {
      fontWeight: "600",
      color: "#f0f6fc",
    },

    authorTitle: {
      fontSize: "14px",
      color: "#8b949e",
    },

    // CTA section
    ctaSection: {
      padding: "100px 0",
      background: "linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
      position: "relative",
      zIndex: 10,
    },

    ctaContent: {
      maxWidth: "800px",
      margin: "0 auto",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "40px",
    },

    ctaTitle: {
      fontSize: "48px",
      fontWeight: "800",
      lineHeight: "1.1",
      pointerEvents: "none",
      userSelect: "none",
      textShadow: "0 0 30px rgba(56, 189, 248, 0.3)",
      color: "#f0f6fc",
    },

    ctaDescription: {
      fontSize: "20px",
      color: "#8b949e",
      pointerEvents: "none",
      userSelect: "none",
      lineHeight: "1.6",
    },

    ctaButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      justifyContent: "center",
    },

    ctaNote: {
      fontSize: "14px",
      color: "#8b949e",
      pointerEvents: "none",
    },

    // Footer
    footer: {
      backgroundColor: "rgba(13, 17, 23, 0.98)",
      color: "#f0f6fc",
      padding: "80px 0",
      position: "relative",
      zIndex: 10,
      borderTop: "1px solid rgba(56, 189, 248, 0.1)",
    },

    footerGrid: {
      display: "grid",
      gap: "40px",
    },

    footerSection: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    footerLogo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      pointerEvents: "none",
    },

    footerDescription: {
      color: "#8b949e",
      pointerEvents: "none",
      lineHeight: "1.6",
    },

    socialLinks: {
      display: "flex",
      gap: "16px",
    },

    socialLink: {
      color: "#8b949e",
      transition: "all 200ms",
      cursor: "pointer",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid rgba(56, 189, 248, 0.1)",
      backgroundColor: "rgba(56, 189, 248, 0.05)",
    },

    footerTitle: {
      fontSize: "18px",
      fontWeight: "600",
      pointerEvents: "none",
      color: "#f0f6fc",
    },

    footerLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    footerLink: {
      color: "#8b949e",
      textDecoration: "none",
      transition: "color 200ms",
      cursor: "pointer",
    },

    footerBottom: {
      borderTop: "1px solid rgba(56, 189, 248, 0.1)",
      marginTop: "60px",
      paddingTop: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    },

    copyright: {
      color: "#8b949e",
      fontSize: "14px",
      pointerEvents: "none",
    },

    footerBottomLinks: {
      display: "flex",
      gap: "32px",
    },

    footerBottomLink: {
      color: "#8b949e",
      fontSize: "14px",
      textDecoration: "none",
      transition: "color 200ms",
      cursor: "pointer",
    },
  }

  return (
    <div style={styles}>
      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes rotate3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(56, 189, 248, 0.6);
          }
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #0d1117;
        }
        
        .nav-link:hover {
          color: #38bdf8 !important;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        }
        
        .social-link:hover {
          color: #38bdf8 !important;
          background-color: rgba(56, 189, 248, 0.1) !important;
          border-color: rgba(56, 189, 248, 0.3) !important;
          transform: translateY(-2px);
        }
        
        .footer-link:hover {
          color: #38bdf8 !important;
        }
        
        .footer-bottom-link:hover {
          color: #38bdf8 !important;
        }
        
        .template-button:hover {
          background-color: rgba(56, 189, 248, 0.2) !important;
          border-color: rgba(56, 189, 248, 0.5) !important;
          transform: translateY(-2px);
        }
        
        .floating-3d {
          animation: rotate3d 20s linear infinite;
        }
        
        .glow-effect {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
      <style jsx>{`
        /* ── responsive helpers ───────────────────────────── */
        .nav-links      { display: none; }
        .hero-grid      { grid-template-columns: 1fr; gap: 60px; }
        .templates-grid { grid-template-columns: 1fr; }
        .features-grid  { grid-template-columns: 1fr; }
        .steps-grid     { grid-template-columns: 1fr; }
        .benefits-grid  { grid-template-columns: 1fr; }
        .testimonials-grid { grid-template-columns: 1fr; }

        @media (min-width: 768px) {
          .nav-links   { display: flex !important; }
          .hero-buttons { flex-direction: row; }
          .cta-buttons { flex-direction: row; }
          .footer-bottom { flex-direction: row; justify-content: space-between; }
          .templates-grid,
          .features-grid,
          .steps-grid,
          .benefits-grid,
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-title { font-size: 56px; }
          .section-title { font-size: 48px; }
          .cta-title { font-size: 56px; }
        }

        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 80px; }
          .features-grid  { grid-template-columns: repeat(3, 1fr); }
          .templates-grid { grid-template-columns: repeat(4, 1fr); }
          .benefits-grid  { grid-template-columns: repeat(4, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(3, 1fr); }
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
          .hero-title { font-size: 64px; }
          .section-title { font-size: 54px; }
          .cta-title { font-size: 64px; }
        }
      `}</style>

      {/* Interactive Mouse Background */}
      <div style={styles.interactiveBackground}>
        {/* Grid pattern */}
        <div style={styles.gridPattern} />

        {/* Mouse following gradient */}
        <div style={styles.mouseGradient} />

        {/* Trailing particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              ...styles.particle,
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity * 0.8,
              transform: `scale(${particle.opacity})`,
            }}
          />
        ))}

        {/* Floating 3D Objects */}
        {floating3DObjects.map((obj) => (
          <div
            key={obj.id}
            style={{
              ...styles.floating3DObject,
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.size}px`,
              height: `${obj.size}px`,
              transform: `
                translate3d(-50%, -50%, ${obj.z}px) 
                rotateX(${obj.rotateX}deg) 
                rotateY(${obj.rotateY}deg) 
                rotateZ(${obj.rotateZ}deg)
              `,
              opacity: 0.6,
            }}
            className="floating-3d"
          >
            {obj.type === 0 && <div style={styles.cube3D} />}
            {obj.type === 1 && <div style={styles.sphere3D} />}
            {obj.type === 2 && <div style={styles.pyramid3D} />}
            {obj.type === 3 && <div style={styles.sphere3D} />}
          </div>
        ))}

        {/* Static background glows */}
        <div style={styles.staticGlow1} />
        <div style={styles.staticGlow2} />
        <div style={styles.staticGlow3} />
      </div>

      {/* Floating Glass Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navbarInner} className="glow-effect">
          <div style={styles.navContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <FileText style={{ height: "20px", width: "20px", color: "white" }} />
              </div>
              <span style={styles.logoText}>ResumeForge</span>
            </div>

            <nav style={styles.navLinks} className="nav-links">
              <a href="#features" style={styles.navLink} className="nav-link">
                Features
              </a>
              <a href="#how-it-works" style={styles.navLink} className="nav-link">
                How It Works
              </a>
              <a href="#testimonials" style={styles.navLink} className="nav-link">
                Reviews
              </a>
            </nav>

            <div style={styles.navButtons}>
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={handleLoginNavigation}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, { ...styles.buttonPrimary, ...styles.buttonPrimaryHover })
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, styles.buttonPrimary)
                }}
              >
                Get Started Free
              </button>
              <button
                style={{
                  ...styles.button,
                  padding: "12px",
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  borderRadius: "8px",
                }}
              >
                <Menu style={{ height: "20px", width: "20px", color: "#f0f6fc" }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div style={styles.heroGrid} className="hero-grid">
            <div style={styles.heroContent}>
              <div style={styles.heroText}>
                <div style={styles.badge}>🚀 100% Free Forever</div>
                <h1 style={styles.heroTitle} className="hero-title">
                  Beat ATS Systems with
                  <span style={styles.gradientText}> AI-Powered</span> Resumes
                </h1>
                <p style={styles.heroDescription}>
                  Get your resume past ATS filters and into human hands. Our AI analyzes, optimizes, and builds
                  professional resumes that land interviews. Start checking your resume now - completely free!
                </p>
              </div>

              <div style={styles.heroButtons} className="hero-buttons">
                <button
                  style={{ ...styles.button, ...styles.buttonPrimary, ...styles.buttonLarge }}
                  onClick={handleLoginNavigation}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, {
                      ...styles.buttonPrimary,
                      ...styles.buttonPrimaryHover,
                      ...styles.buttonLarge,
                    })
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.target.style, { ...styles.buttonPrimary, ...styles.buttonLarge })
                  }}
                >
                  <Zap style={{ marginRight: "8px", height: "20px", width: "20px" }} />
                  Check My Resume Now
                  <ArrowRight style={{ marginLeft: "8px", height: "20px", width: "20px" }} />
                </button>
                <button
                  style={{ ...styles.button, ...styles.buttonSecondary, ...styles.buttonLarge }}
                  onClick={handleLoginNavigation}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, {
                      ...styles.buttonSecondary,
                      ...styles.buttonSecondaryHover,
                      ...styles.buttonLarge,
                    })
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.target.style, { ...styles.buttonSecondary, ...styles.buttonLarge })
                  }}
                >
                  <Cpu style={{ marginRight: "8px", height: "20px", width: "20px" }} />
                  Build New Resume
                </button>
              </div>

              <div style={styles.heroFeatures}>
                <div style={styles.featureItem}>
                  <Check style={{ height: "16px", width: "16px", color: "#38bdf8" }} />
                  <span>No signup required to start</span>
                </div>
                <div style={styles.featureItem}>
                  <Check style={{ height: "16px", width: "16px", color: "#38bdf8" }} />
                  <span>100% Free forever</span>
                </div>
                <div style={styles.featureItem}>
                  <Check style={{ height: "16px", width: "16px", color: "#38bdf8" }} />
                  <span>Instant results</span>
                </div>
              </div>
            </div>

            <div style={styles.heroImage}>
              <div style={styles.heroImageGlow} />
              <img
                src="https://www.graphicpear.com/wp-content/uploads/2018/05/Dark-Resume-Template-1.jpg"
                alt="ResumeForge ATS Checker Dashboard - Dark Resume Template"
                style={styles.heroImageMain}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div style={styles.badge}>Features</div>
            <h2 style={styles.sectionTitle} className="section-title">
              Everything you need to land your dream job
            </h2>
            <p style={styles.sectionDescription}>
              Powerful AI-driven tools to optimize your resume and increase your chances of getting hired.
            </p>
          </div>

          <div style={styles.featuresGrid} className="features-grid">
            {[
              {
                icon: Target,
                title: "ATS Score Analysis",
                description:
                  "Get instant ATS compatibility scores and detailed analysis of how well your resume performs against applicant tracking systems.",
                color: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.1))",
                iconColor: "#38bdf8",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Suggestions",
                description:
                  "Receive precise, actionable recommendations to improve your resume content, keywords, and formatting for maximum impact.",
                color: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))",
                iconColor: "#8b5cf6",
              },
              {
                icon: Palette,
                title: "Professional Templates",
                description:
                  "Choose from dozens of ATS-friendly, professionally designed templates that make your resume stand out to recruiters.",
                color: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))",
                iconColor: "#ec4899",
              },
              {
                icon: BarChart3,
                title: "Keyword Optimization",
                description:
                  "Automatically optimize your resume with industry-specific keywords that ATS systems and recruiters are looking for.",
                color: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))",
                iconColor: "#22c55e",
              },
              {
                icon: Eye,
                title: "Real-time Preview",
                description:
                  "See exactly how your resume looks to both ATS systems and human recruiters with our dual-view preview feature.",
                color: "linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.1))",
                iconColor: "#f97316",
              },
              {
                icon: Shield,
                title: "Privacy Protected",
                description:
                  "Your data is encrypted and secure. We never share your personal information with third parties.",
                color: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1))",
                iconColor: "#a855f7",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  style={styles.featureCard}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, styles.featureCardHover)
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.target.style, styles.featureCard)
                  }}
                >
                  <div style={{ ...styles.featureIcon, background: feature.color }}>
                    <IconComponent style={{ height: "28px", width: "28px", color: feature.iconColor }} />
                  </div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={styles.howItWorksSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div style={styles.badge}>How It Works</div>
            <h2 style={styles.sectionTitle} className="section-title">
              Get hired in 3 simple steps
            </h2>
            <p style={styles.sectionDescription}>
              Our streamlined process makes it easy to create and optimize your resume for maximum impact.
            </p>
          </div>

          <div style={styles.stepsGrid} className="steps-grid">
            {[
              {
                number: "1",
                title: "Upload or Create",
                description:
                  "Upload your existing resume for analysis or start building a new one from scratch using our templates.",
              },
              {
                number: "2",
                title: "AI Analysis & Optimization",
                description:
                  "Our AI analyzes your resume against ATS requirements and provides detailed suggestions for improvement.",
              },
              {
                number: "3",
                title: "Download & Apply",
                description: "Download your optimized, ATS-friendly resume and start applying to jobs with confidence.",
              },
            ].map((step, index) => (
              <div key={index} style={styles.step}>
                <div style={styles.stepNumber}>{step.number}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefitsSection}>
        <div style={styles.benefitsOverlay} />
        <div style={styles.container}>
          <div style={styles.benefitsContent}>
            <div style={styles.sectionHeader}>
              <div style={{ ...styles.badge, ...styles.benefitsBadge }}>Why Choose ResumeForge</div>
              <h2 style={styles.sectionTitle} className="section-title">
                The smart way to optimize your resume
              </h2>
            </div>

            <div style={styles.benefitsGrid} className="benefits-grid">
              {[
                {
                  icon: FileText,
                  title: "100% Free",
                  description: "No hidden fees, no subscriptions. Completely free forever.",
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered",
                  description: "Advanced AI technology analyzes and optimizes your resume.",
                },
                {
                  icon: Target,
                  title: "ATS Optimized",
                  description: "Ensures your resume passes through applicant tracking systems.",
                },
                {
                  icon: Zap,
                  title: "Instant Results",
                  description: "Get immediate feedback and download optimized resumes instantly.",
                },
              ].map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} style={styles.benefit}>
                    <div style={styles.benefitIcon}>
                      <IconComponent style={{ height: "36px", width: "36px", color: "#38bdf8" }} />
                    </div>
                    <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                    <p style={styles.benefitDescription}>{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={styles.testimonialsSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div style={styles.badge}>Success Stories</div>
            <h2 style={styles.sectionTitle} className="section-title">
              Loved by job seekers worldwide
            </h2>
            <p style={styles.sectionDescription}>See how ResumeForge helped professionals land their dream jobs.</p>
          </div>

          <div style={styles.testimonialsGrid} className="testimonials-grid">
            {[
              {
                text: "ResumeForge helped me identify exactly what was wrong with my resume. After using their suggestions, I got 3 interview calls in just one week! The ATS analysis was spot-on.",
                author: "Sarah Johnson",
                title: "Software Engineer",
              },
              {
                text: "The AI suggestions were incredibly detailed and helpful. I never knew my resume was missing so many important keywords. Now I'm getting responses from companies that never replied before.",
                author: "Michael Chen",
                title: "Marketing Manager",
              },
              {
                text: "I love that it's completely free! The templates are professional and the ATS checker gave me confidence that my resume would actually be seen by recruiters. Landed my dream job in 2 months!",
                author: "Emily Rodriguez",
                title: "UX Designer",
              },
            ].map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard}>
                <div style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ height: "16px", width: "16px", fill: "#38bdf8", color: "#38bdf8" }} />
                  ))}
                </div>
                <p style={styles.testimonialText}>{testimonial.text}</p>
                <div style={styles.testimonialAuthor}>
                  <img src="/placeholder.svg?height=48&width=48" alt={testimonial.author} style={styles.authorImage} />
                  <div>
                    <p style={styles.authorName}>{testimonial.author}</p>
                    <p style={styles.authorTitle}>{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle} className="cta-title">
              Ready to land your dream job?
            </h2>
            <p style={styles.ctaDescription}>
              Join hundreds of thousands of job seekers who have already optimized their resumes with ResumeForge. Start
              analyzing your resume now - it's completely free!
            </p>
            <div style={styles.ctaButtons} className="cta-buttons">
              <button
                style={{ ...styles.button, ...styles.buttonPrimary, ...styles.buttonLarge }}
                onClick={handleLoginNavigation}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, {
                    ...styles.buttonPrimary,
                    ...styles.buttonPrimaryHover,
                    ...styles.buttonLarge,
                  })
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, { ...styles.buttonPrimary, ...styles.buttonLarge })
                }}
              >
                <Zap style={{ marginRight: "8px", height: "20px", width: "20px" }} />
                Check My Resume Free
                <ArrowRight style={{ marginLeft: "8px", height: "20px", width: "20px" }} />
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary, ...styles.buttonLarge }}
                onClick={handleLoginNavigation}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, {
                    ...styles.buttonSecondary,
                    ...styles.buttonSecondaryHover,
                    ...styles.buttonLarge,
                  })
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.target.style, { ...styles.buttonSecondary, ...styles.buttonLarge })
                }}
              >
                <Cpu style={{ marginRight: "8px", height: "20px", width: "20px" }} />
                Build New Resume
              </button>
            </div>
            <p style={styles.ctaNote}>No signup required to start • 100% Free forever • Instant results</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div style={styles.footerSection}>
              <div style={styles.footerLogo}>
                <div style={styles.logoIcon}>
                  <FileText style={{ height: "20px", width: "20px", color: "white" }} />
                </div>
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>ResumeForge</span>
              </div>
              <p style={styles.footerDescription}>
                Beat ATS systems and land more interviews with our AI-powered resume optimization platform. 100% free
                forever.
              </p>
              <div style={styles.socialLinks}>
                <button style={styles.socialLink} className="social-link">
                  <Twitter style={{ height: "20px", width: "20px" }} />
                </button>
                <button style={styles.socialLink} className="social-link">
                  <Linkedin style={{ height: "20px", width: "20px" }} />
                </button>
                <button style={styles.socialLink} className="social-link">
                  <Github style={{ height: "20px", width: "20px" }} />
                </button>
                <button style={styles.socialLink} className="social-link">
                  <Mail style={{ height: "20px", width: "20px" }} />
                </button>
              </div>
            </div>

            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Tools</h3>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink} className="footer-link">
                  ATS Checker
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Resume Builder
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Templates
                </a>
              </div>
            </div>

            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Resources</h3>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Resume Tips
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Interview Guide
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Career Blog
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Job Search Tips
                </a>
              </div>
            </div>

            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>Support</h3>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Help Center
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Contact Us
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  FAQ
                </a>
                <a href="#" style={styles.footerLink} className="footer-link">
                  Feedback
                </a>
              </div>
            </div>
          </div>

          <div style={styles.footerBottom} className="footer-bottom">
            <p style={styles.copyright}>© {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
            <div style={styles.footerBottomLinks}>
              <a href="#" style={styles.footerBottomLink} className="footer-bottom-link">
                Privacy Policy
              </a>
              <a href="#" style={styles.footerBottomLink} className="footer-bottom-link">
                Terms of Service
              </a>
              <a href="#" style={styles.footerBottomLink} className="footer-bottom-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
