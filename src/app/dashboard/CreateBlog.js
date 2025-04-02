import { useState } from 'react';

const CreateBlog = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        content: '',
        category: '',
        tags: '',
        image: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage('Blog created successfully! ✅');
                setFormData({ title: '', author: '', content: '', category: '', tags: '', image: '' });
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setMessage('Failed to create blog. ❌');
        }
    };

    return (
        <div className="container mt-4">
            <div className="common-shad p-4 rounded-3">
                <h1 className="fs-2">📝 Create Blog</h1>
                {message && <p className={message.includes('Error') ? 'text-danger' : 'text-success'}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="form-control mb-2" />
                    <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" required className="form-control mb-2" />
                    <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content" required className="form-control mb-2" />
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="form-control mb-2" />
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="form-control mb-2" />
                    <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="form-control mb-2" />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;