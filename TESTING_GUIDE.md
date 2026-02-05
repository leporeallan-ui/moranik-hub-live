# 🧪 Testing Guide - Moranik Hub Marketplace

## Pre-Testing Checklist

- [ ] Frontend running on http://localhost:3000
- [ ] Backend running on http://localhost:5000
- [ ] Both terminals showing no errors
- [ ] Browser console open (F12)
- [ ] Test files prepared (music, book, or software file)

---

## Test 1: Backend Health Check

**Purpose**: Verify backend is operational

**Steps**:
1. Open browser: `http://localhost:5000/api/health`
2. Expected response:
```json
{ "status": "ok", "message": "Backend server is running" }
```

**Pass/Fail**: ✅ Pass if you see the JSON response

---

## Test 2: Navigation to Upload Portal

**Purpose**: Verify frontend routing works

**Steps**:
1. Open http://localhost:3000
2. Click "📤 Upload Product" button
3. See upload form load

**Expected**:
- Upload form appears
- All form fields visible
- File picker accessible

**Pass/Fail**: ✅ Pass if form displays correctly

---

## Test 3: Upload a Music File

**Purpose**: Test file upload functionality

**Setup**:
- Prepare a small MP3, WAV, or OGG file
- Recommend: Find any short audio file

**Steps**:
1. Go to http://localhost:3000 → "📤 Upload Product"
2. Fill form:
   - **Type**: Music
   - **Title**: "Test Song"
   - **Author**: "Test Artist"
   - **Description**: "Test song for marketplace"
   - **Price**: 4.99
   - **Category**: Pop
   - **File**: Select your music file
3. Click "Upload Product"
4. Wait for success message

**Expected**:
- Form submits
- Success message appears
- Form clears
- File upload completes

**Pass/Fail**: ✅ Pass if you see "Music uploaded successfully!"

---

## Test 4: Verify Upload in Database

**Purpose**: Check if file was saved

**Steps**:
1. Open file: `backend/data/products.json`
2. Look for your uploaded product
3. Check file in: `backend/uploads/music/`

**Expected**:
```json
{
  "id": "...",
  "productType": "music",
  "title": "Test Song",
  "price": 4.99,
  ...
}
```

**Pass/Fail**: ✅ Pass if product appears in JSON and file exists

---

## Test 5: Navigation to Marketplace

**Purpose**: Test marketplace page load

**Steps**:
1. Go to http://localhost:3000
2. Click "📦 Marketplace" button
3. Page loads with product grid

**Expected**:
- Products display in grid
- Your uploaded song appears
- No console errors

**Pass/Fail**: ✅ Pass if marketplace loads and shows products

---

## Test 6: Search Functionality

**Purpose**: Test product search

**Steps**:
1. In marketplace, type in search box: "Test"
2. Check filter results
3. Try different search terms

**Expected**:
- Products filter in real-time
- "Test Song" appears when searching "test"
- No results when searching invalid terms

**Pass/Fail**: ✅ Pass if search filters correctly

---

## Test 7: Filter by Product Type

**Purpose**: Test type filtering

**Steps**:
1. In marketplace, click "🎵 Music" button
2. Verify only music shows
3. Click "📚 Novels" button
4. Should show no products (none uploaded yet)
5. Click "All Products"
6. Everything shows again

**Expected**:
- Filters work correctly
- Music shows when music filter active
- Empty state when no products of type exist

**Pass/Fail**: ✅ Pass if filters work as expected

---

## Test 8: Upload a Novel/Book

**Purpose**: Test different file type

**Setup**:
- Prepare a PDF, TXT, or EPUB file

**Steps**:
1. Go to Upload Product
2. Select "Novel/Book" type
3. Fill form with book details
4. Upload file

**Expected**:
- Book uploads successfully
- Appears in marketplace
- Shows correct file size

**Pass/Fail**: ✅ Pass if book uploads and appears

---

## Test 9: Upload Software

**Purpose**: Test software file type

**Setup**:
- Can use any ZIP file (doesn't need to be real software)
- Minimum 1MB recommended

**Steps**:
1. Go to Upload Product
2. Select "Software" type
3. Fill form
4. Upload file

**Expected**:
- Software uploads successfully
- Appears in marketplace under software type
- File type correct

**Pass/Fail**: ✅ Pass if software uploads correctly

---

## Test 10: Product Card Details

**Purpose**: Verify product information displays correctly

**Steps**:
1. Go to Marketplace
2. Click on a product card
3. Verify all information shows:
   - Product icon (🎵, 📚, 💻)
   - Title
   - Author name
   - Description
   - Price
   - Category badge
   - File size
   - Upload date

**Expected**:
- All product details visible
- Formatting looks good
- No truncated information

**Pass/Fail**: ✅ Pass if all details display correctly

---

## Test 11: API Direct Call

**Purpose**: Test API endpoints directly

**Steps**:
1. Open browser and visit:
```
http://localhost:5000/api/uploads/products
```
2. You should see JSON with all products

**Steps 2** - Get music only:
```
http://localhost:5000/api/uploads/products/type/music
```

**Expected**:
- Valid JSON response
- Products array contains your uploads
- Correct product type filtering

**Pass/Fail**: ✅ Pass if JSON endpoints work

---

## Test 12: Responsive Design

**Purpose**: Test on different screen sizes

**Steps**:
1. Open http://localhost:3000
2. Press F12 to open DevTools
3. Click responsive design button
4. Test on:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

**Expected**:
- UI adapts to screen size
- No layout breaks
- Mobile menu appears on small screens
- Form is readable on all sizes

**Pass/Fail**: ✅ Pass if responsive design works

---

## Test 13: Error Handling

**Purpose**: Test error messages

**Steps 1** - File too large:
1. Try uploading a file > 500MB
2. Should see error message

**Steps 2** - Invalid file type:
1. Try uploading an EXE as music
2. Should see error message

**Steps 3** - Missing required field:
1. Fill form but skip title field
2. Try to upload
3. Should show validation error

**Expected**:
- Clear error messages
- Form doesn't submit with errors
- Helpful error text

**Pass/Fail**: ✅ Pass if errors handled gracefully

---

## Test 14: Multiple Uploads

**Purpose**: Test system stability with multiple products

**Steps**:
1. Upload 5 different files
2. Mix of music, books, software
3. Various prices and descriptions
4. Browse marketplace

**Expected**:
- All 5 products appear
- No duplicates
- All searchable
- All filterable

**Pass/Fail**: ✅ Pass if system handles multiple uploads

---

## Test 15: Browser Console

**Purpose**: Verify no JavaScript errors

**Steps**:
1. Open any page
2. Press F12 to open DevTools
3. Click "Console" tab
4. Perform all operations
5. Check for red error messages

**Expected**:
- No red error messages
- Only normal log/info messages
- No CORS errors
- No 404 errors

**Pass/Fail**: ✅ Pass if console is clean

---

## Performance Tests

### Test 16: Page Load Time
1. Open http://localhost:3000
2. Check Network tab (DevTools)
3. Total load time should be < 2 seconds

### Test 17: Upload Speed
1. Upload a 10MB file
2. Should complete within 5-10 seconds
3. No timeout errors

### Test 18: Search Response
1. Marketplace loaded with 5+ products
2. Type in search box
3. Results should filter instantly (< 100ms)

---

## Manual Test Results Template

```markdown
## Moranik Hub - Test Results
**Date**: [date]
**Tester**: [name]

| Test | Expected | Actual | Pass/Fail | Notes |
|------|----------|--------|-----------|-------|
| Backend Health | JSON response | | | |
| Upload Portal | Form loads | | | |
| Music Upload | Success message | | | |
| Database Save | File in DB | | | |
| Marketplace Load | Products show | | | |
| Search Filter | Results filter | | | |
| Type Filter | Filters work | | | |
| Novel Upload | File uploads | | | |
| Software Upload | File uploads | | | |
| Product Details | All shown | | | |
| API Endpoint | JSON response | | | |
| Responsive | UI adapts | | | |
| Error Handling | Errors show | | | |
| Multiple Files | All appear | | | |
| Console Clean | No errors | | | |

**Summary**: ✅ All tests passed / ❌ Some tests failed

**Issues Found**:
- [Issue 1]
- [Issue 2]

**Notes**:
```

---

## What to Do If Tests Fail

### Upload fails?
- Check backend is running: `node server.js`
- Check browser console for error message
- Verify file type is supported
- Check file size < 500MB
- Look at backend server output for errors

### Marketplace empty?
- Verify product.json has entries
- Check uploads folder has files
- Restart backend server
- Clear browser cache (Ctrl+Shift+Del)

### API returns error?
- Verify backend running on :5000
- Check terminal for error logs
- Check CORS is enabled
- Try fresh browser tab

### UI looks broken?
- Check browser console (F12)
- Try different browser
- Clear cache and reload
- Check screen resolution

---

## Success Criteria

✅ **All tests pass** if:
- ✅ Uploads complete successfully
- ✅ Products appear in marketplace
- ✅ Search/filters work
- ✅ No console errors
- ✅ Responsive design works
- ✅ API endpoints respond

🎉 **You're ready for production** when:
- ✅ All functionality tested
- ✅ No critical errors
- ✅ User experience is smooth
- ✅ Performance is acceptable

---

## Test Data

**Sample Music File** (use any):
- MP3 format
- 3-10 MB
- Title: "My Test Song"
- Artist: "Test Artist"

**Sample Book** (use any):
- PDF format
- 1-5 MB
- Title: "Test Novel"
- Author: "Test Author"

**Sample Software**:
- ZIP format
- Any size
- Title: "Test Software"
- Price: $9.99

---

## Next: Load Testing

Once basic tests pass, you can add:
1. Multiple concurrent uploads
2. Heavy load testing (100+ products)
3. Large file uploads (100+ MB)
4. Stress testing API
5. User acceptance testing

---

Happy Testing! 🧪✨
