package models

type SectionItem struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	CoverPhoto string `json:"cover_photo"`
}

type SectionType struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	SearchType string `json:"search_type"`
}

type SectionTypeItem struct {
	UserID        string `json:"user_id"`
	SectionItemId int    `json:"section_item_id"`
	SectionTypeId int    `json:"section_type_id"`
}

type UserSection struct {
	SectionId  int           `json:"section_id"`
	Title      string        `json:"title"`
	SearchType string        `json:"search_type"`
	Items      []SectionItem `json:"items"`
}

type SectionOption struct {
	SectionTitle string `json:"title"`
	SearchType   string `json:"search_type"`
}
