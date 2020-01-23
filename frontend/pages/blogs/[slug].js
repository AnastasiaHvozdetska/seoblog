import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useState } from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { singleBlog } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';

const SingleBlog = ({ blog }) => {

    const showBlogCategories = blog => {
        return blog.categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
            </Link>
        ))
    }
    const showBlogTags = tags => {
        return blog.tags.map((tag, index) => (
            <Link key={index} href={`/categories/${tag.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
            </Link>
        ))
    }

    return (
        <Layout>
            <main>
                <artice>
                    <div className="container-fluid">
                        <section>
                            <div className="row" style={{marginTop: '-30px'}}>
                                <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} className="img img-fluid featured-image"/>
                            </div>
                        </section>
                        <section>
                            <p className="lead mt-3 mark">
                                Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                            </p>
                            <div className="pb-3">
                                {showBlogCategories(blog)}
                                {showBlogTags(blog)}
                                <br />
                                <br />      
                            </div>
                        </section>
                    </div>

                    <div className="container">
                        <section>
                            <div className="col-md-12 lead">
                                {renderHTML(blog.body)}
                            </div>
                        </section>
                    </div>
                    <div className="container pb-5">
                        <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                        <hr/>
                        <p>here we go</p>
                    </div>
                    
                    <div className="container pb-5">
                        <p>show comments</p>
                    </div>
                </artice>
            </main>
        </Layout>
    )
}

SingleBlog.getInitialProps = ({query}) => {
    return singleBlog(query.slug).then(data => {
        if(data.err) {
            console.log(data.err)
        } else {
            return {
                blog: data,
            }
        }
    })
}

export default SingleBlog;