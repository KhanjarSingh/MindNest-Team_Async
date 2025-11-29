import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, ArrowLeft } from 'lucide-react';


const AddIdea = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    description: '',
    demoLink: '',
    pitchDeckUrl: '',
    ppt_Url: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {

      const response = await axios.post('https://mindnest-team-async.onrender.com/api/v1/ideas', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });


      setMessage('Idea created successfully!');
      setFormData({
        title: '',
        pitch: '',
        description: '',
        demoLink: '',
        pitchDeckUrl: '',
        ppt_Url: '',
      });

    } catch (err) {
      console.error('Error response:', err.response?.data);
      console.error('Full error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Something went wrong';
      const details = err.response?.data?.details ? ` (${JSON.stringify(err.response.data.details)})` : '';
      setError(errorMsg + details);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[url('/Submit-Your-Idea-bg.jpeg')] bg-no-repeat opacity-10 pointer-events-none" style={{backgroundPosition: 'top center', backgroundSize: 'auto 100%'}} />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">SHARE YOUR VISION</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Submit Your Idea</h1>
          <p className="text-muted-foreground">Tell us about your innovative project and join our community</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-2">
                Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your idea title"
              />
            </div>

            {/* Pitch */}
            <div className="space-y-2">
              <label htmlFor="pitch" className="text-sm font-semibold text-foreground flex items-center gap-2">
                Pitch <span className="text-primary">*</span>
              </label>
              <textarea
                id="pitch"
                name="pitch"
                value={formData.pitch}
                onChange={handleChange}
                placeholder="A short summary of your idea (1-2 sentences)"
                required
                rows={3}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-foreground flex items-center gap-2">
                Description <span className="text-primary">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your idea in detail"
                required
                rows={5}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="demoLink" className="text-sm font-semibold text-foreground">
                  Demo Link
                </label>
                <input
                  type="url"
                  id="demoLink"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleChange}
                  placeholder="https://github.com/your-project"
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="pitchDeckUrl" className="text-sm font-semibold text-foreground">
                  Pitch Deck URL
                </label>
                <input
                  type="url"
                  id="pitchDeckUrl"
                  name="pitchDeckUrl"
                  value={formData.pitchDeckUrl}
                  onChange={handleChange}
                  placeholder="https://docs.google.com/..."
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ppt_Url" className="text-sm font-semibold text-foreground">
                PPT URL (Optional)
              </label>
              <input
                type="url"
                id="ppt_Url"
                name="ppt_Url"
                value={formData.ppt_Url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-6 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Submit Idea
                </>
              )}
            </Button>

            {/* Messages */}
            {message && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center">
                {message}
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddIdea;
