Replacements to apply in src:

- next/link -> react-router-dom Link
- next/navigation hooks -> react-router-dom (useNavigate, useParams, useLocation, useSearchParams)
- next/head -> react-helmet-async Helmet (use in pages/layouts as needed)
- next/image -> @/components/Image
- next/script -> index.html or useEffect
- next/dynamic -> React.lazy + Suspense
- next/font -> Google Fonts CSS already present


