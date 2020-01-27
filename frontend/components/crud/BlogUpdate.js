import Link from 'next/link';
import { useState, useEffect } from 'react';

import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';

import { QuillModules, QuillFormats } from '../../helpers/quill';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


import '../../node_modules/react-quill/dist/quill.snow.css';
import { API } from '../../config';

const BlogUpdate = ({ router }) => {
    const [body, setBody] = useState('');

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checked, setChecked] = useState([]); // categories
    const [checkedTag, setCheckedTag] = useState([]); // tags
    
    const token = getCookie('token');

    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: '',
        title: '',
        body: ''
    });

    const { error, success, formData, title } = values;

    useEffect(() => {
        setValues({ ...values, formData: new FormData()})
        initBlog();
        initCategories();
        initTags();
    }, [router]);

    const initBlog = () => {
        if(router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    setValues({...values, title: data.title})
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            })
        }
    };

    const setCategoriesArray = blogCategories => {
        let categoriesArr = [];
        blogCategories.map((category, index) => {
            categoriesArr.push(category._id)
        })
        setChecked(categoriesArr)
    };

    const setTagsArray = blogTags => {
        let tagsArr = [];
        blogTags.map((tag, index) => {
            tagsArr.push(tag._id)
        })
        setCheckedTag(tagsArr)
    };

    const handleToggle = category => () => {
        setValues({ ...values, error: '' });
        // return the first index or -1
        const clickedCategory = checked.indexOf(category);
        const all = [...checked];

        if (clickedCategory === -1) {
            all.push(category);
        } else {
            all.splice(clickedCategory, 1);
        }
        setChecked(all);
        formData.set('categories', all);
    };

    const handleTagsToggle = tag => () => {
        setValues({ ...values, error: '' });
        // return the first index or -1
        const clickedTag = checkedTag.indexOf(tag);
        const all = [...checkedTag];

        if (clickedTag === -1) {
            all.push(tag);
        } else {
            all.splice(clickedTag, 1);
        }
        setCheckedTag(all);
        formData.set('tags', all);
    };

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });
    };

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setTags(data);
            }
        });
    };

    const findOutCategory = category => {
        const result = checked.indexOf(category);

        if(result !== -1) {
            return true
        } else return false
    }

    const findOutTag = tag => {
        const result = checkedTag.indexOf(tag);

        if(result !== -1) {
            return true
        } else return false
    }

    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleToggle(c._id)} checked={findOutCategory(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const showTags = () => {
        return (
            tags &&
            tags.map((t, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagsToggle(t._id)} checked={findOutTag(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        );
    };

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e)
    };

    const editBlog = e => {
        e.preventDefault();
        updateBlog(formData, token, router.query.slug).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ 
                    ...values,
                        title: '',
                        error: '',
                        success: `Blog titled "${data.title}" is updated`
                    });

                if(isAuth() && isAuth().role === 1) {
                    // Router.replace(`/admin/crud/${router.query.slug}`)
                      Router.replace(`/admin}`)
                } else  if(isAuth() && isAuth().role === 0) {
                    // Router.replace(`/user/crud/${router.query.slug}`)
                    Router.replace(`/user`)
                }
                // setBody('');
                // setCategories([]);
                // setTags([]);
            }
        });
    };

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSucces = () => (
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
            {success}
        </div>
    );

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body}
                        placeholder="Write something amazing..."
                        onChange={handleBody}
                    />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}
                    <div className="pt-3">
                        {showSucces()}
                        {showError()}
                    </div>
                    {body && (
                        <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} style={{width: '100%'}}/>
                    )}
                </div>

                <div className="col-md-4">
                    <div>
                        <div className="form-group pb-2">
                            <h5>Featured image</h5>
                            <hr />

                            <small className="text-muted">Max size: 1mb</small>
                            <label className="btn btn-outline-info">
                                Upload featured image
                                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h5>Categories</h5>
                        <hr />

                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr />
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(BlogUpdate);