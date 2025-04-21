import React, { useState } from 'react';
import LeftSidebar from '../plugins/LeftSidebar';
import { HelpCircle, ChevronDown, ChevronUp, Mail, PhoneCall, MessageSquare, FileText, Search } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I apply for a leave?",
      answer: "To apply for a leave, navigate to the 'Leave Application' page from the sidebar menu. Fill out the required fields including leave type, dates, and reason. Upload any necessary supporting documents, and submit your application. You can track the status of your application in the 'Leave History' section."
    },
    {
      id: 2,
      question: "What are the different types of leaves available?",
      answer: "EduLeave supports several types of leaves for students: Medical Leave (for health-related issues, requires medical documentation), Personal Leave (for family emergencies or events), Academic Leave (for workshops, conferences, or educational events), and Bereavement Leave (for loss of immediate family members). Different leaves may have different approval processes and documentation requirements."
    },
    {
      id: 3,
      question: "How long does it take to get a leave approved?",
      answer: "Leave approval times vary depending on the type of leave and department policies. Typically, urgent medical leaves are processed within 24-48 hours. Personal and academic leaves may take 2-3 working days. You'll receive notifications about your leave status changes through the system and via email."
    },
    {
      id: 4,
      question: "What documents do I need to submit for a medical leave?",
      answer: "For medical leaves, you'll need to provide a medical certificate from a registered physician stating the nature of illness and recommended rest period. The certificate should include the doctor's registration number, contact details, and signature. For hospitalizations, a discharge summary may be required. Upload these documents in PDF format when submitting your leave application."
    },
    {
      id: 5,
      question: "How can I check the status of my leave application?",
      answer: "You can check the status of your leave applications in the 'Leave History' page. Each application will be marked as Pending, Approved, or Rejected. You can also view detailed information about each application including reviewer comments and approval dates."
    },
    {
      id: 6,
      question: "Can I cancel or modify a leave application after submission?",
      answer: "Yes, you can cancel or modify a leave application as long as it's still in 'Pending' status. Navigate to the 'Leave History' page, find the application you want to modify, and click on the 'Edit' or 'Cancel' button. Once an application has been approved or rejected, you'll need to contact your department coordinator for any changes."
    },
    {
      id: 7,
      question: "Who approves my leave application?",
      answer: "Leave applications are typically reviewed by your department's academic coordinator or faculty advisor. Medical leaves may require additional approval from the institution's medical officer. The approval hierarchy depends on your department's policies and the type of leave requested."
    },
    {
      id: 8,
      question: "What happens if my leave application is rejected?",
      answer: "If your leave application is rejected, you'll receive a notification with the reason for rejection. You can view detailed feedback in the 'Leave History' page. In many cases, you may be able to reapply with additional documentation or clarification. For urgent situations, consider contacting your department coordinator directly."
    }
  ];
  
  // Contact information
  const contactInfo = [
    {
      title: "Email Support",
      icon: <Mail className="text-indigo-600" size={24} />,
      content: "support@eduleave.edu",
      description: "For general inquiries and support requests"
    },
    {
      title: "Phone Support",
      icon: <PhoneCall className="text-indigo-600" size={24} />,
      content: "(555) 123-4567",
      description: "Available Monday-Friday, 9:00 AM - 5:00 PM"
    },
    {
      title: "Live Chat",
      icon: <MessageSquare className="text-indigo-600" size={24} />,
      content: "Available on Portal",
      description: "Get instant help during business hours"
    },
    {
      title: "Documentation",
      icon: <FileText className="text-indigo-600" size={24} />,
      content: "View User Guide",
      description: "Detailed system documentation and tutorials"
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftSidebar />
      
      <div className="ml-64 flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                <HelpCircle className="mr-2 text-indigo-600" /> Help & Support
              </h1>
              <p className="mt-2 text-gray-600">
                Find answers to frequently asked questions or contact our support team for assistance.
              </p>
              
              {/* Search bar */}
              <div className="mt-6 relative max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 mr-4">
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{contact.title}</h3>
                    <p className="text-indigo-600 font-medium mt-1">{contact.content}</p>
                    <p className="text-sm text-gray-500 mt-1">{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQs Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h3 className="font-medium text-gray-800">{faq.question}</h3>
                      {expandedFaq === faq.id ? 
                        <ChevronUp className="h-5 w-5 text-indigo-600" /> : 
                        <ChevronDown className="h-5 w-5 text-indigo-600" />
                      }
                    </div>
                    
                    {expandedFaq === faq.id && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms or browse all FAQs.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Additional Resources */}
          <div className="mt-6 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">Need More Help?</h2>
            <p className="text-indigo-700">
              If you couldn't find what you're looking for, please contact your department's academic coordinator or submit a support ticket through the portal.
            </p>
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Submit Support Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;