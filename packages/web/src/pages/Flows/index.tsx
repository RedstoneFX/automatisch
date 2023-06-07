import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import debounce from 'lodash/debounce';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import type { IFlow } from '@automatisch/types';

import FlowRow from 'components/FlowRow';
import NoResultFound from 'components/NoResultFound';
import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import { GET_FLOWS } from 'graphql/queries/get-flows';
import { IMPORT_FLOW } from 'graphql/mutations/import-flow';
import * as URLS from 'config/urls';

const FLOW_PER_PAGE = 10;

const getLimitAndOffset = (page: number) => ({
  limit: FLOW_PER_PAGE,
  offset: (page - 1) * FLOW_PER_PAGE,
});

export default function Flows(): React.ReactElement {
  const navigate = useNavigate();
  const importRef = React.useRef<HTMLInputElement>(null);
  const [importFlow] = useMutation(IMPORT_FLOW);
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const [flowName, setFlowName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [getFlows, { data }] = useLazyQuery(GET_FLOWS, {
    onCompleted: () => {
      setLoading(false);
    },
  });

  const fetchData = React.useMemo(
    () =>
      debounce(
        (name) =>
          getFlows({
            variables: {
              ...getLimitAndOffset(page),
              name,
            },
          }),
        300
      ),
    [page, getFlows]
  );

  React.useEffect(
    function fetchFlowsOnSearch() {
      setLoading(true);

      fetchData(flowName);
    },
    [fetchData, flowName]
  );

  React.useEffect(
    function resetPageOnSearch() {
      // reset search params which only consists of `page`
      setSearchParams({});
    },
    [flowName]
  );

  React.useEffect(function cancelDebounceOnUnmount() {
    return () => {
      fetchData.cancel();
    };
  }, []);

  const { pageInfo, edges } = data?.getFlows || {};

  const flows: IFlow[] = edges?.map(({ node }: { node: IFlow }) => node);
  const hasFlows = flows?.length;

  const handleImportChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    event.target.value = null;

    const reader = new FileReader()
    reader.onload = async (e: any) => {
      const inputData = JSON.parse(e.target.result);
      const response = await importFlow({ variables: { input: inputData } })
      const flowId = response.data?.importFlow?.id;

      navigate(URLS.FLOW_EDITOR(flowId), { replace: true });
    };
    reader.readAsText(fileObj)
  };

  const onSearchChange = React.useCallback((event) => {
    setFlowName(event.target.value);
  }, []);

  const onImportFlow = React.useCallback(() => {
    importRef.current?.click();
  }, []);

  const CreateFlowLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
        function InlineLink(linkProps, ref) {
          return <Link ref={ref} to={URLS.CREATE_FLOW} {...linkProps} />;
        }
      ),
    []
  );

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('flows.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>

          <Grid
            container
            item
            xs="auto"
            sm="auto"
            alignItems="center"
            spacing={2}
            order={{ xs: 1, sm: 2 }}
          >
            <Grid item>
              <ConditionalIconButton
                type="submit"
                variant="outlined"
                color="primary"
                size="large"
                onClick={onImportFlow}
                fullWidth
                icon={<UploadFileIcon />}
                data-test="import-flow-button"
              >
                {formatMessage('flows.importFlow')}
              </ConditionalIconButton>
            </Grid>

            <Grid item>
              <ConditionalIconButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                component={CreateFlowLink}
                fullWidth
                icon={<AddIcon />}
                data-test="create-flow-button"
              >
                {formatMessage('flows.create')}
              </ConditionalIconButton>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {loading && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!loading &&
          flows?.map((flow) => <FlowRow key={flow.id} flow={flow} />)}

        {!loading && !hasFlows && (
          <NoResultFound
            text={formatMessage('flows.noFlows')}
            to={URLS.CREATE_FLOW}
          />
        )}

        {!loading && pageInfo && pageInfo.totalPages > 1 && (
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
            page={pageInfo?.currentPage}
            count={pageInfo?.totalPages}
            onChange={(event, page) =>
              setSearchParams({ page: page.toString() })
            }
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
        )}
      </Container>
      <input
        style={{ display: 'none' }}
        ref={importRef}
        type="file"
        onChange={handleImportChange}
      />
    </Box>
  );
}
