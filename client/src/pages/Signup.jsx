import { useState } from "react"
import axios from "axios"
import {
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"
import { auth } from "../firebase.js"

/**
 * ExpenseFlow — Signup page
 * Vite + React
 */
export default function Signup() {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const [error, setError] = useState("")


  // --------------------------------------------------------------------------
  // Normal Username + Email + Password Signup
  // --------------------------------------------------------------------------

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    const username = String(
      formData.get("username") || ""
    ).trim()

    const email = String(
      formData.get("email") || ""
    ).trim()

    const password = String(
      formData.get("password") || ""
    )

    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    )


    // Frontend validation
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      setError(
        "Please fill in all fields to continue."
      )

      setLoading(false)

      return
    }


    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters long."
      )

      setLoading(false)

      return
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match. Please re-enter them."
      )

      setLoading(false)

      return
    }


    try {

      const response = await axios.post(
        "http://localhost:3000/auth/signup",
        {
          userName: username,
          email,
          password
        }
      )


      console.log(
        "Signup successful:",
        response.data
      )


      // Backend JWT
      const token = response.data.token


      // Store JWT
      if (token) {

        localStorage.setItem(
          "token",
          token
        )

      }


      // Store user information
      if (
        response.data.id ||
        response.data.username ||
        response.data.email
      ) {

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            username:
              response.data.username ||
              response.data.userName ||
              username,
            email:
              response.data.email ||
              email
          })
        )

      }


      alert("Account created successfully!")


      // Later:
      // navigate("/dashboard")

    } catch (error) {

      console.error(
        "Signup error:",
        error
      )


      if (error.response) {

        const message =
          error.response.data?.error ||
          error.response.data ||
          "Signup failed"

        setError(message)

      } else {

        setError(
          "Unable to connect to server"
        )

      }

    } finally {

      setLoading(false)

    }
  }


  // --------------------------------------------------------------------------
  // Google Signup
  // --------------------------------------------------------------------------

  const handleGoogleSignUp = async () => {

    setError("")
    setGoogleLoading(true)

    try {

      // 1. Create Google provider
      const provider =
        new GoogleAuthProvider()


      // 2. Open Google login popup
      const result =
        await signInWithPopup(
          auth,
          provider
        )


      // 3. Get Firebase ID token
      const idToken =
        await result.user.getIdToken()


      console.log(
        "Firebase ID Token received"
      )


      // 4. Send Firebase token to backend
      const response =
        await axios.post(
          "http://localhost:3000/auth/google",
          {
            idToken
          }
        )


      console.log(
        "Google signup successful:",
        response.data
      )


      // 5. Backend gives us OUR JWT
      const token =
        response.data.token


      // Store JWT
      localStorage.setItem(
        "token",
        token
      )


      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          username:
            response.data.username ||
            response.data.userName,
          email:
            response.data.email ||
            result.user.email
        })
      )


      alert(
        "Google signup successful!"
      )


      // Later:
      // navigate("/dashboard")

    } catch (error) {

      console.error(
        "Google signup error:",
        error
      )


      if (error.response) {

        const message =
          error.response.data?.error ||
          error.response.data ||
          "Google signup failed"

        setError(message)

      } else {

        setError(
          "Google authentication failed"
        )

      }

    } finally {

      setGoogleLoading(false)

    }
  }


  return (

    <div className="ef-root text-[var(--ef-foreground)]">

      <ScopedStyles />

      <main className="grid min-h-svh bg-[var(--ef-background)] lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">


        {/* Desktop branding */}

        <section className="hidden lg:block">

          <BrandPanel />

        </section>


        {/* Signup section */}

        <section className="relative flex flex-col items-center justify-center px-5 py-10 sm:px-8">


          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 100% 0%, color-mix(in oklch, var(--ef-accent) 55%, transparent) 0%, transparent 45%), radial-gradient(90% 70% at 0% 100%, color-mix(in oklch, var(--ef-accent) 35%, transparent) 0%, transparent 40%)",
            }}
          />


          <div className="ef-animate-in relative flex w-full max-w-md flex-col items-center">


            {/* Mobile logo */}

            <div className="mb-8 lg:hidden">

              <Logo />

            </div>


            <div className="w-full rounded-[1.925rem] border border-[color-mix(in_oklch,var(--ef-border)_70%,transparent)] bg-[color-mix(in_oklch,var(--ef-card)_95%,transparent)] p-7 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_12px_40px_-12px_rgba(16,40,34,0.18)] backdrop-blur-sm sm:p-9">

              <SignupForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                handleSubmit={handleSubmit}
                handleGoogleSignUp={handleGoogleSignUp}
                loading={loading}
                googleLoading={googleLoading}
                error={error}
              />

            </div>


            <p className="mt-6 max-w-md text-center text-xs leading-relaxed text-[var(--ef-muted-foreground)]">

              By creating an account, you agree to our{" "}

              <a
                href="#"
                className="font-medium underline-offset-4 transition-colors hover:text-[var(--ef-foreground)] hover:underline"
              >
                Terms
              </a>{" "}

              and{" "}

              <a
                href="#"
                className="font-medium underline-offset-4 transition-colors hover:text-[var(--ef-foreground)] hover:underline"
              >
                Privacy Policy
              </a>

              .

            </p>

          </div>

        </section>

      </main>

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* Signup Form                                                                */
/* -------------------------------------------------------------------------- */

function SignupForm({
  showPassword,
  setShowPassword,
  showConfirm,
  setShowConfirm,
  handleSubmit,
  handleGoogleSignUp,
  loading,
  googleLoading,
  error
}) {

  return (

    <div className="w-full">


      <div className="mb-7">

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklch,var(--ef-border)_70%,transparent)] bg-[color-mix(in_oklch,var(--ef-accent)_60%,transparent)] px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-[var(--ef-accent-foreground)]">

          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--ef-primary)]"
            aria-hidden="true"
          />

          Create your account

        </span>


        <h2 className="ef-serif mt-4 text-[1.75rem] font-semibold leading-tight tracking-tight text-[var(--ef-foreground)]">

          Get started free

        </h2>


        <p className="mt-2 text-[0.925rem] leading-relaxed text-[var(--ef-muted-foreground)]">

          Set up your ExpenseFlow account in less than a minute.

        </p>

      </div>


      {/* Error */}

      {error && (

        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          {error}

        </div>

      )}


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >


        {/* Username */}

        <Field
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="janedoe"
          autoComplete="username"
          icon={<IconUser />}
          required
        />


        {/* Email */}

        <Field
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<IconMail />}
          required
        />


        {/* Password */}

        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          show={showPassword}
          onToggle={() =>
            setShowPassword(
              (prev) => !prev
            )
          }
        />


        {/* Confirm Password */}

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          show={showConfirm}
          onToggle={() =>
            setShowConfirm(
              (prev) => !prev
            )
          }
        />


        {/* Signup button */}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-[1.225rem] bg-[var(--ef-primary)] text-sm font-semibold text-[var(--ef-primary-foreground)] shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--ef-primary)_92%,black)] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading
            ? "Creating account..."
            : "Create Account"
          }

        </button>

      </form>


      {/* Divider */}

      <div
        className="my-6 flex items-center gap-4"
        role="separator"
      >

        <span className="h-px flex-1 bg-[var(--ef-border)]" />

        <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--ef-muted-foreground)]">

          or

        </span>

        <span className="h-px flex-1 bg-[var(--ef-border)]" />

      </div>


      {/* Google */}

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[1.225rem] border border-[color-mix(in_oklch,var(--ef-border)_80%,transparent)] bg-[var(--ef-card)] text-sm font-medium text-[var(--ef-foreground)] outline-none transition-all hover:-translate-y-0.5 hover:border-[var(--ef-border)] hover:bg-[var(--ef-secondary)] hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >

        <GoogleIcon />

        {googleLoading
          ? "Signing up with Google..."
          : "Continue with Google"
        }

      </button>


      {/* Login */}

      <p className="mt-8 text-center text-sm text-[var(--ef-muted-foreground)]">

        Already have an account?{" "}

        <a
          href="#"
          className="rounded-sm font-semibold text-[var(--ef-primary)] underline-offset-4 outline-none transition-colors hover:text-[color-mix(in_oklch,var(--ef-primary)_80%,transparent)] hover:underline"
        >
          Sign In
        </a>

      </p>

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* Input Field                                                                */
/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  icon,
  ...props
}) {

  return (

    <div className="space-y-2">

      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--ef-foreground)]"
      >
        {label}
      </label>


      <div className="group relative">

        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ef-muted-foreground)] transition-colors group-focus-within:text-[var(--ef-primary)]">

          {icon}

        </span>


        <input
          id={id}
          className="ef-input"
          {...props}
        />

      </div>

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* Password Field                                                             */
/* -------------------------------------------------------------------------- */

function PasswordField({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  show,
  onToggle
}) {

  return (

    <div className="space-y-2">

      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--ef-foreground)]"
      >
        {label}
      </label>


      <div className="group relative">

        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ef-muted-foreground)] transition-colors group-focus-within:text-[var(--ef-primary)]">

          <IconLock />

        </span>


        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="ef-input pr-11"
        />


        <button
          type="button"
          onClick={onToggle}
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[0.875rem] text-[var(--ef-muted-foreground)] outline-none transition-colors hover:bg-[var(--ef-muted)] hover:text-[var(--ef-foreground)]"
        >

          {show
            ? <IconEyeOff />
            : <IconEye />
          }

        </button>

      </div>

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* Brand panel                                                                */
/* -------------------------------------------------------------------------- */

function BrandPanel() {

  return (

    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[var(--ef-primary)] p-10 text-[var(--ef-primary-foreground)] xl:p-14">


      <div className="relative">

        <Logo
          labelClassName="text-[var(--ef-primary-foreground)] text-xl"
        />

      </div>


      <div className="relative max-w-md">

        <h1 className="ef-serif text-[2rem] font-semibold leading-[1.1] tracking-tight xl:text-[2.6rem]">

          Take control of your spending.

        </h1>


        <p className="mt-4 max-w-sm leading-relaxed text-[color-mix(in_oklch,var(--ef-primary-foreground)_80%,transparent)]">

          Track expenses, set budgets, and see exactly where your money goes — all in one calm, clear dashboard.

        </p>


        <div className="mt-10 rounded-[1.575rem] border border-[color-mix(in_oklch,var(--ef-primary-foreground)_15%,transparent)] bg-[color-mix(in_oklch,var(--ef-primary-foreground)_8%,transparent)] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-[color-mix(in_oklch,var(--ef-primary-foreground)_60%,transparent)]">

                Net balance

              </p>


              <p className="ef-serif mt-1 text-3xl font-semibold tracking-tight">

                $8,642.15

              </p>

            </div>


            <span className="flex items-center gap-0.5 rounded-full bg-[color-mix(in_oklch,var(--ef-primary-foreground)_15%,transparent)] px-2 py-1 text-xs font-medium">

              +18.4%

              <IconArrowUpRight />

            </span>

          </div>


          <Sparkline />

        </div>


        <div className="mt-4 grid grid-cols-2 gap-3">

          <StatCard
            icon={<IconTrendingUp />}
            label="Spent"
            value="$2,480"
          />

          <StatCard
            icon={<IconCoins />}
            label="Saved"
            value="$1,120"
          />

        </div>

      </div>


      <div className="relative flex items-center gap-2 text-sm text-[color-mix(in_oklch,var(--ef-primary-foreground)_70%,transparent)]">

        <IconShieldCheck />

        <span>

          Bank-level encryption · © {new Date().getFullYear()} ExpenseFlow

        </span>

      </div>

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* Sparkline                                                                  */
/* -------------------------------------------------------------------------- */

function Sparkline() {

  const points =
    "0,26 14,22 28,25 42,16 56,19 70,11 84,14 98,6 112,9 126,3"


  return (

    <svg
      viewBox="0 0 126 30"
      className="mt-4 h-12 w-full"
      fill="none"
      preserveAspectRatio="none"
    >

      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />


      <polygon
        points={`${points} 126,30 0,30`}
        fill="currentColor"
        className="opacity-10"
      />

    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* Stat card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value
}) {

  return (

    <div className="rounded-[1.575rem] border border-[color-mix(in_oklch,var(--ef-primary-foreground)_15%,transparent)] bg-[color-mix(in_oklch,var(--ef-primary-foreground)_8%,transparent)] px-4 py-3.5">

      <span className="flex h-8 w-8 items-center justify-center rounded-[0.875rem] bg-[color-mix(in_oklch,var(--ef-primary-foreground)_15%,transparent)]">

        {icon}

      </span>


      <p className="mt-3 text-xs text-[color-mix(in_oklch,var(--ef-primary-foreground)_60%,transparent)]">

        {label} this month

      </p>


      <p className="ef-serif text-lg font-semibold">

        {value}

      </p>

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* Logo                                                                       */
/* -------------------------------------------------------------------------- */

function Logo({
  labelClassName = "",
  showWordmark = true
}) {

  return (

    <div className="flex items-center gap-2.5">

      <span className="flex h-9 w-9 items-center justify-center rounded-[1.225rem] bg-[var(--ef-primary)] text-[var(--ef-primary-foreground)] shadow-sm">

        <IconWallet />

      </span>


      {showWordmark && (

        <span
          className={`ef-serif text-lg font-semibold tracking-tight ${labelClassName}`}
        >

          ExpenseFlow

        </span>

      )}

    </div>
  )
}


/* -------------------------------------------------------------------------- */
/* SVG helper                                                                 */
/* -------------------------------------------------------------------------- */

function Svg({
  children,
  size = 16,
  className = ""
}) {

  return (

    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >

      {children}

    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function IconUser() {

  return (

    <Svg>

      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />

      <circle
        cx="12"
        cy="7"
        r="4"
      />

    </Svg>
  )
}


function IconMail() {

  return (

    <Svg>

      <rect
        width="20"
        height="16"
        x="2"
        y="4"
        rx="2"
      />

      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />

    </Svg>
  )
}


function IconLock() {

  return (

    <Svg>

      <rect
        width="18"
        height="11"
        x="3"
        y="11"
        rx="2"
        ry="2"
      />

      <path d="M7 11V7a5 5 0 0 1 10 0v4" />

    </Svg>
  )
}


function IconEye() {

  return (

    <Svg>

      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />

    </Svg>
  )
}


function IconEyeOff() {

  return (

    <Svg>

      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />

      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />

      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 1 1 0 0 1-1.444 2.49" />

      <path d="m2 2 20 20" />

    </Svg>
  )
}


function IconWallet() {

  return (

    <Svg size={20}>

      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" />

      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />

    </Svg>
  )
}


function IconArrowUpRight() {

  return (

    <Svg size={12}>

      <path d="M7 7h10v10" />

      <path d="M7 17 17 7" />

    </Svg>
  )
}


function IconTrendingUp() {

  return (

    <Svg>

      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />

      <polyline points="16 7 22 7 22 13" />

    </Svg>
  )
}


function IconCoins() {

  return (

    <Svg>

      <circle
        cx="8"
        cy="8"
        r="6"
      />

      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />

      <path d="M7 6h1v4" />

      <path d="m16.71 13.88.7.71-2.82 2.82" />

    </Svg>
  )
}


function IconShieldCheck() {

  return (

    <Svg>

      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />

      <path d="m9 12 2 2 4-4" />

    </Svg>
  )
}


function GoogleIcon() {

  return (

    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />

      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />

      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />

    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* Scoped styles                                                              */
/* -------------------------------------------------------------------------- */

function ScopedStyles() {

  return (

    <style>{`

      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap');


      .ef-root {

        --ef-background: oklch(0.977 0.006 240);
        --ef-foreground: oklch(0.21 0.03 250);
        --ef-card: oklch(1 0 0);
        --ef-primary: oklch(0.58 0.13 163);
        --ef-primary-foreground: oklch(0.99 0.01 160);
        --ef-secondary: oklch(0.96 0.01 240);
        --ef-muted: oklch(0.965 0.006 240);
        --ef-muted-foreground: oklch(0.53 0.02 250);
        --ef-accent: oklch(0.95 0.03 165);
        --ef-accent-foreground: oklch(0.35 0.08 163);
        --ef-border: oklch(0.92 0.008 240);
        --ef-input: oklch(0.92 0.008 240);
        --ef-ring: oklch(0.58 0.13 163);

        font-family:
          'Inter',
          ui-sans-serif,
          system-ui,
          sans-serif;

        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;

      }


      .ef-serif {

        font-family:
          'Sora',
          'Inter',
          ui-sans-serif,
          system-ui,
          sans-serif;

      }


      .ef-input {

        height: 2.75rem;
        width: 100%;
        border-radius: 1.225rem;
        border: 1px solid var(--ef-input);
        background: var(--ef-card);
        padding-left: 2.5rem;
        padding-right: 0.75rem;
        font-size: 0.875rem;
        color: var(--ef-foreground);

        box-shadow:
          0 1px 2px rgba(16, 40, 34, 0.05);

        transition:
          color 0.2s,
          box-shadow 0.2s,
          border-color 0.2s;

      }


      .ef-input::placeholder {

        color:
          var(--ef-muted-foreground);

      }


      .ef-input:hover {

        border-color:
          color-mix(
            in oklch,
            var(--ef-ring) 50%,
            transparent
          );

      }


      .ef-input:focus-visible {

        outline: none;

        border-color:
          var(--ef-ring);

        box-shadow:
          0 0 0 4px
          color-mix(
            in oklch,
            var(--ef-ring) 15%,
            transparent
          );

      }


      .ef-animate-in {

        animation:
          ef-fade-in 0.7s ease-out both;

      }


      @keyframes ef-fade-in {

        from {

          opacity: 0;
          transform:
            translateY(0.75rem);

        }

        to {

          opacity: 1;
          transform: none;

        }

      }


      @media (prefers-reduced-motion: reduce) {

        .ef-animate-in {

          animation: none;

        }

      }

    `}</style>
  )
}