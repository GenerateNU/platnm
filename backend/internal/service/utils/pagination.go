package utils

type Pagination struct {
	Page  *int `query:"page"`
	Limit *int `query:"limit"`
}

const (
	defaultPage  int = 1
	defaultLimit int = 10
)

func (p *Pagination) Validate() map[string]string {
	errs := make(map[string]string)

	if p.Page == nil {
		page := defaultPage
		p.Page = &page
	} else if *p.Page < 1 {
		errs["page"] = "page must be greater than or equal to 1"
	}

	if p.Limit == nil {
		limit := defaultLimit
		p.Limit = &limit
	} else if *p.Limit < 1 {
		errs["limit"] = "limit must be greater than or equal to 1"
	}

	return errs
}

func (p *Pagination) GetOffset() int {
	return (*p.Page - 1) * *p.Limit
}
