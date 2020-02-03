import Head from 'next/head';
import Layout from '../../components/Layout';
import Cart from '../../components/blog/Card';
import { singleCategory } from "../../actions/category";
import { DOMAIN, APP_NAME, FB_APP_ID } from '../../config';

const Category = ({ category, blogs, query }) => {

    const head = () => (
        <Head>
            <title>{category.name} | {APP_NAME}</title>
            <meta name="description" 
                  content={`Best programming tutorials on ${category.name}`} />
            <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`}/>
            <meta property="og:title" content={`${category.name} | ${APP_NAME}`}/>
            <meta 
                property="og:description" 
                content={`Best programming tutorials on ${category.name}`} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    )

   return (
       <React.Fragment>
           {head()}
           <Layout>
               <main>
                   <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                  {category.name}
                                </h1>
                                {blogs.map((blog, index) => (
                                    <div>
                                        <Cart blog={blog} key={index} />
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        </header>
                   </div>
               </main>
           </Layout>
       </React.Fragment>
   )
}


Category.getInitialProps = ({ query }) => {
    return singleCategory(query.slug).then(data => {
        if(data.err) {
            console.log(data.err)
        } else {
            return {
                category: data.category,
                blogs: data.blogs,
                query
            }
        }
    })
}

export default Category;