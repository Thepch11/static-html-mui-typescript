import { AppBar, Box, Button, Chip, Container, Divider, Link, Paper, Stack, Toolbar, Typography } from '@mui/material';

const resources = [
  { title: 'Documents', path: 'documents/getting-started.md', type: 'Markdown', description: 'Start with the project structure, preview commands, and content conventions.' },
  { title: 'Reports', path: 'reports/build-overview.json', type: 'JSON', description: 'A sample report describing the static architecture. Replace it with your own data.' },
  { title: 'Assets', path: 'assets/mark.svg', type: 'SVG', description: 'Shared images, icons, and downloadable files served alongside the application.' },
];

export default function App() {
  return (
    <>
      <Link href="#main" className="skip-link">Skip to content</Link>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
            <Box component="img" src="./assets/mark.svg" alt="" width={32} height={32} />
            <Typography sx={{ fontWeight: 700, flexGrow: 1 }}>Static Workspace</Typography>
            <Button component="a" href="#resources">Resources</Button>
            <Button component="a" href="https://github.com/Thepch11/static-html-mui-typescript">Repository ↗</Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" id="main" maxWidth="lg" sx={{ py: { xs: 5, md: 9 } }}>
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {['React', 'TypeScript', 'Material UI'].map((label) => <Chip key={label} label={label} variant="outlined" size="small" />)}
          </Stack>
          <Typography component="h1" variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, lineHeight: 1.06 }}>
            One simple home for your documents & reports.
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.7 }}>
            A responsive foundation for static content. Built with React and MUI, packaged as HTML, JavaScript, and CSS, ready for static hosting.
          </Typography>
          <Box><Button component="a" href="#resources" variant="contained" size="large">Explore resources ↓</Button></Box>
        </Stack>
        <Box component="section" id="resources" aria-labelledby="resources-heading" sx={{ mt: { xs: 7, md: 10 }, scrollMarginTop: 24 }}>
          <Typography component="h2" variant="h4" id="resources-heading" sx={{ mb: 3 }}>Project resources</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {resources.map((resource, index) => (
              <Paper component="article" variant="outlined" key={resource.title} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                <Typography variant="overline" color="text.secondary">0{index + 1} / {resource.type}</Typography>
                <Typography component="h3" variant="h5">{resource.title}</Typography>
                <Typography color="text.secondary" sx={{ flexGrow: 1 }}>{resource.description}</Typography>
                <Button component="a" href={`./${resource.path}`}>Open {resource.title.toLowerCase()} →</Button>
              </Paper>
            ))}
          </Box>
        </Box>
        <Paper component="section" aria-labelledby="output-heading" variant="outlined" sx={{ mt: 4, p: { xs: 3, md: 4 }, bgcolor: '#eaf0e9' }}>
          <Typography component="h2" variant="h5" id="output-heading" gutterBottom>Small structure. Clear boundaries.</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Edit TypeScript in src/. Build the deployable folder with npm run build.</Typography>
          <Box component="pre" sx={{ m: 0, overflowX: 'auto', fontSize: '0.9rem', lineHeight: 1.8 }}>{'dist/\n├── index.html\n├── bundle.js\n├── styles.css\n├── documents/\n├── reports/\n└── assets/'}</Box>
        </Paper>
      </Container>
      <Divider />
      <Container component="footer" maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary">Static HTML MUI TypeScript · Client-side application · No backend required</Typography>
      </Container>
    </>
  );
}
