'use client';
import { ForgotPasswordForm } from '@/modules/domains/common/auth/ForgotPasswordForm';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

export default function ForgotPasswordPage() {
  return (
    <>
      <DocumentTitle text="Forgot Password — Common Theme" />
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-border bg-surface-raised shadow-sm p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-subtle text-3xl">
                🔒
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Forgot password?</h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <ForgotPasswordForm
            onSubmit={async (_email) => {
              await new Promise((r) => setTimeout(r, 1000));
            }}
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-text-secondary">
            Remember your password?{' '}
            <a href="/theme/common/auth/login" className="text-primary font-medium hover:underline">
              Back to login
            </a>
          </p>
          <p className="text-sm text-text-secondary">
            No account yet?{' '}
            <a href="/theme/common/auth/register" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
