import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/blog/Card';
import { useState } from 'react';
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import Blog from '../admin/crud/blog';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';


const Blogs = ({ blogs, categories, tags, size, router }) => {

    const head = () => (
        <Head>
            <title>Programming blogs | {APP_NAME}</title>
            <meta name="description" 
                content="Programming blogs and tutorial on react node next php laravel and web development" />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`}/>
            <meta property="og:title" content={`Latest web deleopment tutorials | ${APP_NAME}`}/>
            <meta 
                property="og:description" 
                content="Programming blogs and tutorial on react node next php laravel and web development" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    )

    const showAllBlogs = () => {
        return blogs.map((blog, index) => (
            <article key={index}>
                <Card blog={blog} />
                <hr/>
            </article>
        ))
    }

    const showAllCategories = () => {
        return categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
            </Link>
        ))
    }

    const showAllTags = () => {
        return tags.map((tag, index) => (
            <Link key={index} href={`/tags/${tag.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
            </Link>
        ))
    }

    return (
       <React.Fragment>
           {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">
                                    Programming blogs and tutorials
                                </h1>
                            </div>
                            <section>
                                <div className="pb-5 text-center">
                                    {showAllCategories()}
                                    <br />
                                    {showAllTags()}
                                </div>
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                {showAllBlogs()}
                            </div>
                        </div>
                    </div>
                </main>
            </Layout>
       </React.Fragment>
    )
};

Blogs.getInitialProps = () => {
    return listBlogsWithCategoriesAndTags().then(data => {
        if(data.err) {
            console.log(data.err)
        } else {
            console.log(data)
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                size: data.size
            }
        }
    })
}

export default withRouter(Blogs); // getInitialProps