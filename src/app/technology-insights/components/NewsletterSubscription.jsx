'use client';
import React, { useState } from 'react';
import Icon from '../../com/components/AppIcon';
import Button from '../../com/components/ui/Button';
import Input from '../../com/components/ui/Input';
import { Checkbox } from '../../com/components/ui/Checkbox';

const NewsletterSubscription = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    industry: '',
    interests: []
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const roles = [
    'CTO/Technology Leader',
    'IT Director/Manager',
    'Software Developer',
    'Product Manager',
    'Business Analyst',
    'Consultant',
    'Other'
  ];

  const industries = [
    'Healthcare',
    'Finance & Banking',
    'Retail & E-commerce',
    'Manufacturing',
    'Education',
    'Government',
    'Startup',
    'Other'
  ];

  const interests = [
    { id: 'ai-ml', label: 'AI/ML & Data Science', description: 'Latest developments in artificial intelligence and machine learning' },
    { id: 'cloud', label: 'Cloud & Infrastructure', description: 'Cloud migration strategies, DevOps, and infrastructure optimization' },
    { id: 'mobile', label: 'Mobile Development', description: 'Cross-platform development, native apps, and mobile UX trends' },
    { id: 'web', label: 'Web Technologies', description: 'Frontend frameworks, web performance, and modern web development' },
    { id: 'security', label: 'Cybersecurity', description: 'Security best practices, compliance, and threat management' },
    { id: 'transformation', label: 'Digital Transformation', description: 'Business process optimization and organizational change' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interestId, checked) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev?.interests, interestId]
        : prev?.interests?.filter(id => id !== interestId)
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Saved to the database (Admin → Leads) and emailed to the team.
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, formType: 'newsletter' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not subscribe. Please try again.');
        return;
      }
      setIsSubmitted(true);
    } catch {
      setError('Could not subscribe. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">Welcome to TechByteX Insights!</h3>
        <p className="text-secondary mb-6">
          Thank you for subscribing. You'll receive your first curated insights newsletter within 24 hours.
        </p>
        <div className="bg-white rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-primary mb-2">What to expect:</h4>
          <ul className="text-left text-secondary space-y-1">
            <li>• Weekly technology insights and trend analysis</li>
            <li>• Exclusive case studies and implementation guides</li>
            <li>• Early access to webinars and resources</li>
            <li>• Personalized content based on your interests</li>
          </ul>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          iconName="Edit"
          iconPosition="left"
        >
          Update Preferences
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Mail" size={32} className="text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">Stay Ahead with Technology Insights</h3>
        <p className="text-secondary">
          Get curated weekly insights with personalization based on your role, industry, and technology interests
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData?.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            required
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData?.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          description="We'll never share your email with third parties"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Role</label>
            <select
              name="role"
              value={formData?.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              required
            >
              <option value="">Select your role</option>
              {roles?.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Industry</label>
            <select
              name="industry"
              value={formData?.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              required
            >
              <option value="">Select your industry</option>
              {industries?.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-4">
            Content Interests (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests?.map((interest) => (
              <div key={interest?.id} className="bg-white rounded-lg p-4 border border-border">
                <Checkbox
                  label={interest?.label}
                  checked={formData?.interests?.includes(interest?.id)}
                  onChange={(e) => handleInterestChange(interest?.id, e?.target?.checked)}
                />
                <p className="text-sm text-secondary mt-1 ml-6">{interest?.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-accent mt-1" />
            <div>
              <h4 className="font-medium text-primary mb-1">Privacy & Data Protection</h4>
              <p className="text-sm text-secondary">
                Your information is protected by enterprise-grade security. You can unsubscribe at any time, 
                and we'll never share your data with third parties. Read our{' '}
                <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> for details.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          iconName="ArrowRight"
          iconPosition="right"
          className="bg-accent hover:bg-accent/90 text-white"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe to Insights'}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-secondary">
          Practical web, app and AI insights from the TechByteX team
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscription;