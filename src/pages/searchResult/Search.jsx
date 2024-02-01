import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "../../utilis/api";
import ContentWrapper from "../../components/contentWrapper/contentWrapper";
import Spinner from "../../components/spinner/Spinner";
import MovieCard from "../../components/movieCard/MovieCard";

const Search = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        setData(res);
        setLoading(false);
        setPageNum((prev) => prev + 1);
      }
    );
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data?.results, ...res.results],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    setPageNum(1)
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${data?.total_results > 1 ? "results" : "result"}
                of "${query}"`}
              </div>
              <InfiniteScroll
              className="content"
              dataLength={data?.results?.length || []}
              next={fetchNextPageData}
              hasMore={pageNum<=data?.total_page}
              loader={<Spinner/>}
              >
                {data?.results?.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry result not Found</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default Search;
