import { CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ProofVerificationProps {
  verified: boolean;
  proofHash: string;
}

export function ProofVerification({ verified, proofHash }: ProofVerificationProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(proofHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Proof Verification</h3>
        <div className="flex items-center space-x-2">
          {verified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="status-badge status-verified">Verified</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="status-badge status-error">Not Verified</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proof Hash
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-800 break-all">
              {proofHash}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy proof hash"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">What this proves:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Treasury assets exceed liabilities (solvency)</li>
            <li>• Data integrity without exposing sensitive details</li>
            <li>• Report authenticity and tamper-proof verification</li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Verified on Midnight Network
          </span>
          <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1">
            <span>View on Explorer</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
